# 🧠 Calimero AI Prompt Template (for Cursor / AI builders)

This markdown file is meant to be used as a **prompt template** for AI tools like **Cursor**, **GitHub Copilot**, or other LLM-based assistants that can scaffold Calimero applications.

It includes:
- The full build & workflow guide for Calimero apps  
- Commentary on how to use it as an AI prompt  
- Code patterns and best practices
- Common pitfalls and troubleshooting

> 💡 Copy this entire markdown into your AI environment (Cursor, Copilot, etc.)  
> Then replace the app specification section at the end with your own app idea.

---

## 🧾 Getting Started

Let's build a Calimero application together:

First step is to scaffold a new project:

```bash
npx create-mero-app <application_name>
cd <application_name>
pnpm install
```

You can familiarize yourself with how to build by reading the README,  
but here is a simple overview of how things work.

---

## 🗂️ Project Structure (generated)

All Calimero applications follow this structure:

```
my-app/
├── logic/                          # Rust backend (WASM)
│   ├── src/
│   │   ├── lib.rs                  # Main entry point with #[app::state] and #[app::logic]
│   │   ├── <domain>.rs             # Domain models (e.g., game.rs, board.rs, players.rs)
│   │   ├── events.rs               # Event definitions
│   │   └── validation.rs           # Business rule validators
│   ├── Cargo.toml
│   └── res/                        # Generated ABI files
├── app/                            # React frontend
│   ├── src/
│   │   ├── App.tsx                 # Main React component
│   │   ├── api/
│   │   │   └── AbiClient.ts        # Auto-generated from Rust
│   │   ├── components/             # React components
│   │   └── pages/                  # Page components
│   └── package.json
├── workflows/                      # Merobox network configurations
│   └── local-network.yml
└── package.json                    # Root scripts for orchestration
```

**Key top-level scripts:**
- `pnpm logic:build`: builds WASM + ABI  
- `pnpm app:generate-client`: generates typed client from ABI  
- `pnpm app:dev`: runs frontend dev server  
- `pnpm network:bootstrap`: boots Merobox workflow  

> 💡 When you run `pnpm logic:build`, the app automatically generates the client.  
> If you change the logic `package_name`, update the `applicationId` after running the Merobox workflow.

---

## ⚙️ Backend Logic Guidelines (Rust)

### 1. State Definition

```rust
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::app;
use calimero_storage::collections::UnorderedMap;

#[app::state]
#[derive(Default, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct AppState {
    // Use UnorderedMap for key-value storage
    pub items: UnorderedMap<String, Item>,
    pub counter: u64,
}
```

**Key points:**
- Use `#[app::state]` macro to mark your state struct
- Derive `BorshSerialize` and `BorshDeserialize` for efficient serialization
- Use `UnorderedMap<String, T>` for keys. **Avoid `u64` keys** (storage requires `AsRef<[u8]>`)
- Keep state flat and simple - avoid complex nested structures

### 2. Logic Implementation

```rust
#[app::logic]
impl AppState {
    // Public methods are exposed as callable endpoints
    pub fn create_item(&mut self, id: String, data: ItemData) -> Result<(), String> {
        // 1. Validate inputs
        if id.is_empty() {
            return Err("ID cannot be empty".to_string());
        }
        
        if self.items.get(&id)?.is_some() {
            return Err("Item already exists".to_string());
        }
        
        // 2. Create item
        let item = Item::new(id.clone(), data);
        
        // 3. Update state
        self.items.insert(id.clone(), item)?;
        
        // 4. Emit event
        app::emit!(ItemCreated {
            id,
            timestamp: env::time_now(),
        });
        
        Ok(())
    }
    
    pub fn get_item(&self, id: String) -> Result<Option<Item>, String> {
        Ok(self.items.get(&id)?.cloned())
    }
}
```

**Key points:**
- Use `#[app::logic]` macro on your impl block
- All public methods are callable from the frontend
- Follow pattern: **validate → mutate → emit**
- Use `app::emit!` for events
- Return `Result<T, String>` for operations that can fail
- Read-only methods should take `&self`, mutations take `&mut self`
- **Always handle `Result` from storage operations** (use `?` operator)

### 3. Timestamps in WASM

For timestamps in WASM, use the Calimero env helper (not `std::time::SystemTime`):

```rust
use calimero_sdk::env;

let timestamp = env::time_now(); // returns block time in ms
```

[Source: core/env.rs#L114](https://github.com/calimero-network/core/blob/5880b882fc948cafdd8be7ecb69613047086946e/crates/storage/src/env.rs#L114)

### 4. Domain Models

```rust
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Item {
    pub id: String,
    pub data: ItemData,
    pub created_at: u64,
    pub updated_at: u64,
}

impl Item {
    pub fn new(id: String, data: ItemData) -> Self {
        let timestamp = env::time_now();
        Self {
            id,
            data,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }
}
```

**Key points:**
- All types must derive `BorshSerialize` and `BorshDeserialize`
- Use simple types: `String`, `u64`, `bool`, `Vec`, `Option`
- Implement constructor methods for initialization
- Keep models immutable where possible

### 5. Events

```rust
use calimero_sdk::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "calimero_sdk::serde")]
pub enum AppEvent {
    ItemCreated {
        id: String,
        timestamp: u64,
    },
    ItemUpdated {
        id: String,
        timestamp: u64,
    },
    ItemDeleted {
        id: String,
        timestamp: u64,
    },
}
```

**Key points:**
- Events use Serde for JSON serialization (not Borsh)
- Use enum for different event types
- Include relevant data and timestamps
- Keep events immutable - they're historical records

### 6. Validation Patterns

Use the Strategy Pattern for complex validation:

```rust
pub trait Validator<T> {
    fn validate(&self, item: &T) -> Result<(), String>;
}

pub struct LengthValidator {
    min: usize,
    max: usize,
}

impl Validator<String> for LengthValidator {
    fn validate(&self, item: &String) -> Result<(), String> {
        if item.len() < self.min {
            return Err(format!("Too short (min: {})", self.min));
        }
        if item.len() > self.max {
            return Err(format!("Too long (max: {})", self.max));
        }
        Ok(())
    }
}

// Compose validators
pub fn validate_input(input: &String) -> Result<(), String> {
    let validators: Vec<Box<dyn Validator<String>>> = vec![
        Box::new(LengthValidator { min: 1, max: 100 }),
        Box::new(NonEmptyValidator),
    ];
    
    for validator in validators {
        validator.validate(input)?;
    }
    Ok(())
}
```

**Why this pattern:**
- Separates different validation concerns
- Makes it easy to add/remove rules without touching core logic
- Enables clear unit testing of each rule independently

### 7. Returning Complex Types

If you return complex types to the frontend:
- Make them `Serialize` and return directly if ABI supports them, or
- Serialize to JSON String in view functions:

```rust
pub fn get_all_items(&self) -> Result<String, String> {
    let items: Vec<Item> = self.items.values()?.collect();
    serde_json::to_string(&items).map_err(|e| e.to_string())
}
```

### 8. Helper Methods

Avoid exposing helper methods with conflicting names (e.g., multiple `from_string`, `to_string`). Prefer private helpers or unique names to avoid ABI codegen conflicts.

---

## 🔨 Build Flow (Authoritative)

1. Edit Rust logic in `logic/src/lib.rs`.
2. Build WASM + ABI:
   ```bash
   pnpm logic:build
   ```
3. Generate frontend ABI client (if ABI changed):
   ```bash
   pnpm app:generate-client
   ```
4. Run frontend:
   ```bash
   pnpm app:dev
   ```

---

## 🧩 Merobox Workflow (install, context, prefill)

Update workflow to install the built WASM and create a context:

```yaml
# workflows/local-network.yml
name: My App Local Network

nodes:
  - name: node-1
    port: 2428
    admin_port: 2528
  - name: node-2
    port: 2429
    admin_port: 2529

contexts:
  - name: my-app-context
    application:
      path: ../logic/res/<your_app>.wasm
    members:
      - node-1
      - node-2
```

Add steps to call your logic methods to prefill demo data (e.g. create items, add users).

Run:
```bash
pnpm network:bootstrap
```

Grab the captured `applicationId` and update:

```ts
// app/src/App.tsx
const [clientAppId] = useState<string>('REPLACE_WITH_applicationId');
```

---

## 💻 Frontend Integration

### 1. ABI Client Generation

After building Rust code, the TypeScript client is auto-generated at `app/src/api/AbiClient.ts`.

Use it via an app-aware factory:

```typescript
import { useEffect, useState } from 'react';
import { AbiClient } from './api/AbiClient';

function App() {
  const [client, setClient] = useState<AbiClient | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // Initialize client
  useEffect(() => {
    const initClient = async () => {
      const contexts = await app.fetchContexts();
      const context = contexts[0];
      const api = new AbiClient(app, context);
      setClient(api);
    };
    initClient();
  }, []);

  // Subscribe to events
  useEffect(() => {
    if (!client) return;

    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'ItemCreated') {
        // Update state
        loadItems();
      }
    });

    return unsubscribe;
  }, [client]);

  // Call Rust methods
  const createItem = async (id: string, data: ItemData) => {
    try {
      await client?.createItem(id, data);
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  return (
    <div>
      <button onClick={() => createItem('id-1', someData)}>
        Create Item
      </button>
      {/* Render items */}
    </div>
  );
}
```

### 2. Handling JSON Returns

If ABI return types are JSON strings, parse on the client:

```ts
const itemsJson = await api.getAllItems();
const items = JSON.parse(itemsJson);
```

---

## 🧯 Common Pitfalls + Fixes

### Missing export errors from mero-ui:

```bash
pnpm --dir app update @calimero-network/mero-ui --latest
rm -rf app/node_modules/.vite
pnpm --dir app dev
```

Optionally log exports to debug:
```ts
import * as UI from '@calimero-network/mero-ui';
console.log(Object.keys(UI));
```

If any named exports are missing (e.g., Modal/Badge), temporarily shim them with simple styled elements, then re-upgrade `@calimero-network/mero-ui` and clear Vite cache.

### Other common fixes:

- **ABI codegen "Duplicate method names"** → make helpers private or rename  
- **`UnorderedMap` iteration** → use `.entries()?` or `.values()?`
- **WASM time panic** → use `env::time_now()` instead of `std::time::SystemTime`
- **Key types** → use `String` keys, convert IDs with `.to_string()`
- **Storage operations** → always handle `Result` with `?` operator

---

## ⚙️ Quality-of-Life Scripts

Add to top-level `package.json`:

```json
{
  "scripts": {
    "logic:build": "cd logic && cargo build --target wasm32-unknown-unknown --release",
    "logic:watch": "watchexec -w logic/src 'pnpm logic:build && pnpm logic:sync'",
    "logic:sync": "cp logic/target/wasm32-unknown-unknown/release/*.wasm workflows/",
    "logic:clean": "cd logic && cargo clean",
    
    "app:install": "cd app && pnpm install",
    "app:dev": "cd app && pnpm dev",
    "app:build": "cd app && pnpm build",
    "app:generate-client": "calimero-sdk-abi-generator --rust logic/src/lib.rs --output app/src/api/",
    
    "network:bootstrap": "merobox --workflow workflows/local-network.yml up",
    "network:down": "merobox --workflow workflows/local-network.yml down",
    
    "dev": "concurrently -k -n logic,app \"pnpm logic:build --watch\" \"pnpm app:dev\"",
    "rebuild": "pnpm logic:build && pnpm app:generate-client"
  }
}
```

---

## 🚀 End-to-End Quickstart

```bash
# Scaffold
npx create-mero-app shared-todo-backlog
cd shared-todo-backlog

# Dependencies
pnpm install
pnpm add @calimero-network/mero-ui@latest

# Build backend + client
pnpm logic:build
pnpm app:generate-client

# Run Merobox bootstrap (installs wasm, creates context, pre-fills demo data)
pnpm network:bootstrap

# Set applicationId in app/src/App.tsx from bootstrap output
# Then run the frontend
pnpm app:dev
```

---

## 📐 Best Practices

1. **Keep state simple** - Avoid deep nesting, prefer flat structures
2. **Validate early** - Check inputs before mutating state
3. **Emit events** - Every state change should emit an event
4. **Use types** - Leverage Rust's type system for correctness
5. **Test validation** - Write unit tests for validators
6. **Document methods** - Add doc comments to public methods
7. **Handle errors** - Return descriptive errors, don't panic
8. **Keep methods focused** - One method, one responsibility
9. **Use String keys** - For UnorderedMap keys (not u64)
10. **Avoid external calls** - Keep logic pure and deterministic
11. **Handle storage Results** - Always use `?` operator for storage operations
12. **Use env::time_now()** - For timestamps in WASM

---

## 🔗 Common Patterns

### Ownership/Permissions

```rust
use calimero_sdk::env;

pub fn update_item(&mut self, id: String, data: ItemData) -> Result<(), String> {
    let caller = env::executor_id();
    
    let item = self.items.get(&id)?
        .ok_or("Item not found")?;
    
    if item.owner != caller {
        return Err("Not authorized".to_string());
    }
    
    // Update logic...
    Ok(())
}
```

### Pagination

```rust
pub fn list_items(&self, offset: usize, limit: usize) -> Result<Vec<Item>, String> {
    let items: Vec<Item> = self.items
        .values()?
        .skip(offset)
        .take(limit)
        .cloned()
        .collect();
    Ok(items)
}
```

### Error Handling

```rust
// Use Result for operations that can fail
pub fn risky_operation(&mut self) -> Result<String, String> {
    // Validate
    if !self.is_valid() {
        return Err("Invalid state".to_string());
    }
    
    // Execute (propagate errors with ?)
    let result = self.do_something()?;
    
    Ok(result)
}
```

---

## 🧪 Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_item() {
        let mut state = AppState::default();
        
        let result = state.create_item(
            "test-id".to_string(),
            ItemData { /* ... */ }
        );
        
        assert!(result.is_ok());
        assert!(state.items.get(&"test-id".to_string()).unwrap().is_some());
    }
    
    #[test]
    fn test_duplicate_item_fails() {
        let mut state = AppState::default();
        
        state.create_item("test-id".to_string(), ItemData { /* ... */ }).unwrap();
        
        let result = state.create_item("test-id".to_string(), ItemData { /* ... */ });
        
        assert!(result.is_err());
    }
}
```

---

## 📚 References

- Calimero env time helper: `env::time_now()`  
  [core/env.rs#L114](https://github.com/calimero-network/core/blob/5880b882fc948cafdd8be7ecb69613047086946e/crates/storage/src/env.rs#L114)
- [Storage (CRDT Collections)](https://github.com/calimero-network/core/blob/master/crates/storage/README.md)
- [SDK Documentation](https://github.com/calimero-network/core/blob/master/crates/sdk/README.md)

---

## 🎯 Your Instructions

When I describe my application to you:

1. **Ask clarifying questions** about:
   - Core functionality and user flows
   - Data structures needed
   - Business rules and validation
   - Privacy requirements
   - Number of users/nodes

2. **Create the full project structure** following the patterns above

3. **Implement**:
   - Rust backend with proper state management
   - Domain models with validation
   - Event definitions
   - TypeScript client integration (show the pattern, actual generation happens via CLI)
   - React frontend with real-time updates
   - Merobox configuration for local testing
   - Build scripts in package.json

4. **Follow best practices**:
   - Use String keys for UnorderedMap
   - Implement validation strategies
   - Emit events for all state changes
   - Add error handling throughout
   - Include basic tests
   - Document public methods
   - Use env::time_now() for timestamps
   - Handle storage Results properly

5. **Explain your choices**:
   - Why certain patterns were used
   - Trade-offs made
   - How to extend the code

---

## ⚔️ Example Application Specification

Let's build a **Battleships** game as a Calimero application.

- Two players each add their ships to the board  
- Once setup is done, players take turns firing shots  
- The Calimero logic handles:
  - State sync between player nodes  
  - Validation of turns  
  - Real-time updates via node callbacks (v0.9.0+)  

> You can customize this spec to your own app idea — just replace this section with your requirements and share with your AI dev assistant (Cursor, Copilot, etc.)

---

🧩 **Template designed for AI-assisted Calimero app generation.**
