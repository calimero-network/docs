# Calimero SDK Guide for Builders

The Calimero SDK (`core/crates/sdk` and `core/crates/storage`) provides everything you need to build distributed, peer-to-peer applications with automatic conflict-free synchronization.

## Overview

The SDK consists of two main components:

- **Application SDK** (`core/crates/sdk`): Macros, event system, private storage, and runtime integration
- **Storage SDK** (`core/crates/storage`): CRDT collections with automatic merge semantics

Together, they enable you to build applications with:
- Automatic conflict resolution via CRDTs
- Real-time event propagation
- Private node-local storage
- Type-safe state management

## Core Concepts

### State Definition

Applications define **state** using the `#[app::state]` macro:

```rust
use calimero_sdk::app;
use calimero_storage::collections::UnorderedMap;
use calimero_sdk::borsh::{BorshSerialize, BorshDeserialize};

#[app::state(emits = Event)]
#[derive(BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct MyApp {
    // CRDT-backed state (automatically synchronized)
    items: UnorderedMap<String, String>,
    
    // Can nest CRDTs arbitrarily
    nested: UnorderedMap<String, UnorderedMap<String, u64>>,
}
```

**Key points:**
- State is persisted and synchronized across nodes
- Must derive `BorshSerialize` and `BorshDeserialize` for persistence
- Use `#[app::state(emits = Event)]` to enable event emission

### Logic Implementation

Implement **logic** using the `#[app::logic]` macro:

```rust
#[app::logic]
impl MyApp {
    // Initialize state (called once on context creation)
    #[app::init]
    pub fn init() -> MyApp {
        MyApp {
            items: UnorderedMap::new(),
            nested: UnorderedMap::new(),
        }
    }
    
    // Mutation method (changes state, generates delta)
    pub fn add_item(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key, value)?;
        Ok(())
    }
    
    // View method (read-only, no delta generated)
    #[app::view]
    pub fn get_item(&self, key: &str) -> app::Result<Option<String>> {
        self.items.get(key)?.map(|v| v.get().clone()).ok_or_else(|| app::Error::NotFound)
    }
}
```

**Key points:**
- `#[app::init]` marks the initialization function
- Mutation methods (`&mut self`) generate deltas and sync
- View methods (`#[app::view]`) are read-only and faster
- Use `app::Result<T>` for error handling

### CRDT Collections

The SDK provides several CRDT collection types:

#### UnorderedMap<K, V>

Key-value storage with automatic conflict resolution:

```rust
use calimero_storage::collections::UnorderedMap;

let mut map: UnorderedMap<String, String> = UnorderedMap::new();

// Insert value (conflict-free)
map.insert("key".to_string(), "value".to_string())?;

// Get value
let value = map.get("key")?;  // Returns Option<V>

// Remove value
map.remove("key")?;

// Check existence
if map.contains("key")? {
    // ...
}

// Iterate entries
for (key, value) in map.entries()? {
    // ...
}
```

#### Vector<T>

Ordered list with element-wise merging:

```rust
use calimero_storage::collections::Vector;

let mut vec: Vector<String> = Vector::new();

// Append element
vec.push("item".to_string())?;

// Get element by index
let item = vec.get(0)?;  // Returns Option<T>

// Insert at position
vec.insert(0, "first".to_string())?;

// Remove element
vec.remove(0)?;
```

#### Counter

Distributed counter with automatic summation:

```rust
use calimero_storage::collections::Counter;

let mut counter = Counter::new();

// Increment
counter.increment()?;

// Decrement
counter.decrement()?;

// Get value
let value = counter.value();  // Returns i64
```

#### LwwRegister<T>

Last-Write-Wins register for single values:

```rust
use calimero_storage::collections::LwwRegister;

let mut register: LwwRegister<String> = LwwRegister::new("initial".to_string());

// Set value (latest timestamp wins)
register.set("updated".to_string())?;

// Get value
let value = register.get().clone();
```

#### UnorderedSet<T>

Set with union-based merging:

```rust
use calimero_storage::collections::UnorderedSet;

let mut set: UnorderedSet<String> = UnorderedSet::new();

// Insert element
set.insert("item".to_string())?;

// Check membership
if set.contains("item")? {
    // ...
}

// Remove element
set.remove("item")?;
```

### Event System

Applications can emit events for real-time updates:

```rust
#[app::state(emits = Event)]
pub struct MyApp {
    items: UnorderedMap<String, String>,
}

// Define event types
#[app::event]
pub enum Event<'a> {
    ItemAdded {
        key: &'a str,
        value: &'a str,
    },
    ItemRemoved {
        key: &'a str,
    },
}

#[app::logic]
impl MyApp {
    pub fn add_item(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key.clone(), value.clone())?;
        
        // Emit event (propagated to all peers)
        app::emit!(Event::ItemAdded {
            key: &key,
            value: &value,
        });
        
        Ok(())
    }
}
```

**Event lifecycle:**
1. Emitted during method execution
2. Included in delta broadcast
3. Handlers execute on peer nodes (not author node)
4. Handlers can update UI or trigger side effects

### Private Storage

For node-local data (secrets, caches, per-node counters):

```rust
use calimero_sdk::private_storage;

pub fn use_private_storage() {
    // Create private entry
    let secrets = private_storage::entry::<Secrets>("my-secrets");
    
    // Read value
    let current = secrets.get_or_init(|| Secrets::default());
    
    // Modify value (never synced, stays on node)
    secrets.write(|s| {
        s.token = "rotated-token".to_string();
    });
}
```

**Key properties:**
- Never replicated across nodes
- Stored via `storage_read` / `storage_write` directly
- Never included in CRDT deltas
- Only accessible on the executing node

## Common Patterns

### Pattern 1: Simple Key-Value Store

```rust
#[app::state(emits = Event)]
pub struct KvStore {
    items: UnorderedMap<String, LwwRegister<String>>,
}

#[app::logic]
impl KvStore {
    #[app::init]
    pub fn init() -> KvStore {
        KvStore {
            items: UnorderedMap::new(),
        }
    }
    
    pub fn set(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key, value.into())?;
        Ok(())
    }
    
    #[app::view]
    pub fn get(&self, key: &str) -> app::Result<Option<String>> {
        Ok(self.items.get(key)?.map(|v| v.get().clone()))
    }
}
```

### Pattern 2: Counter with Metrics

```rust
#[app::state]
pub struct Metrics {
    page_views: UnorderedMap<String, Counter>,
}

#[app::logic]
impl Metrics {
    #[app::init]
    pub fn init() -> Metrics {
        Metrics {
            page_views: UnorderedMap::new(),
        }
    }
    
    pub fn track_page_view(&mut self, page: String) -> app::Result<()> {
        if let Some(counter) = self.page_views.get(&page)? {
            counter.increment()?;
        } else {
            let mut counter = Counter::new();
            counter.increment()?;
            self.page_views.insert(page, counter)?;
        }
        Ok(())
    }
    
    #[app::view]
    pub fn get_views(&self, page: &str) -> app::Result<i64> {
        Ok(self.page_views.get(page)?.map(|c| c.value()).unwrap_or(0))
    }
}
```

### Pattern 3: Nested Structures

```rust
#[app::state]
pub struct TeamMetrics {
    // Map of team → Map of member → Counter
    teams: UnorderedMap<String, UnorderedMap<String, Counter>>,
}

#[app::logic]
impl TeamMetrics {
    pub fn increment_metric(
        &mut self,
        team: String,
        member: String,
    ) -> app::Result<()> {
        let members = self.teams
            .entry(team)?
            .or_insert_with(|| UnorderedMap::new());
        
        let counter = members
            .entry(member)?
            .or_insert_with(|| Counter::new());
        
        counter.increment()?;
        Ok(())
    }
}
```

## Building Applications

### Project Setup

```bash
# Create new Rust project
cargo new my-calimero-app
cd my-calimero-app

# Add dependencies to Cargo.toml
[dependencies]
calimero-sdk = { path = "../../core/crates/sdk" }
calimero-storage = { path = "../../core/crates/storage" }
calimero-sdk-macros = { path = "../../core/crates/sdk/macros" }
borsh = { version = "1.0", features = ["derive"] }

[lib]
crate-type = ["cdylib"]

[dependencies.calimero-sdk]
features = ["macro"]
```

### Build to WASM

```bash
# Add WASM target
rustup target add wasm32-unknown-unknown

# Build WASM binary
cargo build --target wasm32-unknown-unknown --release

# Output: target/wasm32-unknown-unknown/release/my_calimero_app.wasm
```

### Extract ABI

```bash
# Extract ABI from WASM
calimero-abi extract \
  target/wasm32-unknown-unknown/release/my_calimero_app.wasm \
  -o abi.json
```

## Best Practices

1. **Always use CRDTs**: Don't use regular Rust collections for synchronized state
2. **Mark views with `#[app::view]`**: Improve performance and intent clarity
3. **Handle errors properly**: Use `app::Result<T>` and meaningful error types
4. **Use private storage for secrets**: Never put secrets in CRDT state
5. **Emit events for UI updates**: Enable real-time updates across nodes
6. **Test with multiple nodes**: Verify sync behavior in multi-node scenarios

## Deep Dives

For detailed SDK documentation:

- **Application SDK**: [`core/crates/sdk/README.md`](https://github.com/calimero-network/core/blob/master/crates/sdk/README.md) - Complete API reference
- **Storage Collections**: [`core/crates/storage/README.md`](https://github.com/calimero-network/core/blob/master/crates/storage/README.md) - CRDT types and semantics
- **Examples**: [`core/apps`](https://github.com/calimero-network/core/tree/master/apps) - Working application examples

## Related Topics

- [Getting Started](../getting-started/index.md) - Complete getting started guide
- [Applications](../core-concepts/applications.md) - Application architecture overview
- [Core Apps Examples](../examples/core-apps-examples.md) - Reference implementations

