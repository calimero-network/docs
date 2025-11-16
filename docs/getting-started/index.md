# Getting Started

Welcome to Calimero! This guide will help you get up and running quickly, whether you're building applications, running nodes, or just exploring the platform.

## Quick Start Paths

Choose your path based on what you want to do:

| Goal | Path | Time |
| --- | --- | --- |
| **Run a local network** | Installation → Launch network | 10 min |
| **Build an application** | Installation → Create app → Deploy | 30 min |
| **Explore examples** | Installation → Run example | 15 min |

## Step 1: Installation

### Prerequisites

**Required:**
- **Docker** 20.10+ (for running nodes)
- **Python** 3.8+ (for merobox)
- **Node.js** 18+ (for client SDKs and building JavaScript apps)
- **Rust toolchain** (for building Rust applications)

**Optional:**
- `merod` and `meroctl` (if building from source)

### Install Merobox

Merobox is the easiest way to run local Calimero networks:

```bash
# Using pipx (recommended)
pipx install merobox

# Or on macOS with Homebrew
brew install calimero-network/tap/merobox

# Verify installation
merobox --version
```

### Install Rust Toolchain (for building applications)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Verify installation
cargo --version
rustc --version
```

### Install Node.js SDKs (for client development)

```bash
# Install Calimero JavaScript SDK
npm install @calimero/sdk @calimero/cli

# Or with pnpm
pnpm add @calimero/sdk @calimero/cli
```

See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme) for complete installation options.

## Step 2: Run a Local Network

### Using Merobox (Recommended)

```bash
# Start a 2-node network
merobox run --count 2

# Check status
merobox list

# View logs
merobox logs node1 --follow
```

### Using Docker Directly

```bash
# Start coordinator
docker run -p 2528:2528 ghcr.io/calimero-network/merod:edge \
  --node-type coordinator

# Start peer (in another terminal)
docker run -p 2529:2528 ghcr.io/calimero-network/merod:edge \
  --node-type peer \
  --swarm-addrs /ip4/127.0.0.1/tcp/2428
```

### Verify Network

```bash
# Check node health
meroctl --node-name node1 health

# List contexts
meroctl --node-name node1 context list
```

See [Running Nodes](../operator-track/run-a-local-network.md) for detailed node management.

## Step 3: Build Your First Application

### Option A: Create from Template

```bash
# Create a new application
npx create-mero-app my-first-app

# Navigate to project
cd my-first-app

# Install dependencies
pnpm install

# Build Rust backend
pnpm run logic:build

# This creates:
# - logic/build/my_first_app.wasm (WASM binary)
# - logic/build/my_first_app.abi.json (API definition)
```

### Option B: Build from Core Examples

```bash
# Clone core repository
git clone https://github.com/calimero-network/core
cd core/apps/kv-store

# Build WASM
./build.sh

# Install on node
meroctl --node-name node1 app install \
  --path build/kv_store.wasm
```

### Option C: Build from Scratch

**1. Create Rust project:**
```bash
cargo new --lib my-app
cd my-app
```

**2. Add dependencies to `Cargo.toml`:**
```toml
[dependencies]
calimero-sdk = { path = "../../crates/sdk" }
calimero-storage = { path = "../../crates/storage" }
```

**3. Write your application in `src/lib.rs`:**
```rust
use calimero_sdk::app;
use calimero_storage::collections::UnorderedMap;

#[app::state]
pub struct MyApp {
    items: UnorderedMap<String, String>,
}

#[app::logic]
impl MyApp {
    pub fn add_item(&mut self, key: String, value: String) {
        self.items.insert(key, value);
    }
    
    #[app::view]
    pub fn get_item(&self, key: &str) -> Option<String> {
        self.items.get(key)
    }
}
```

**4. Build WASM:**
```bash
cargo build --target wasm32-unknown-unknown --release
```

**5. Install on node:**
```bash
meroctl --node-name node1 app install \
  --path target/wasm32-unknown-unknown/release/my_app.wasm
```

See [SDK Guide](../builder-directory/sdk-guide.md) or [JavaScript SDK Guide](../builder-directory/js-sdk-guide.md) for detailed development guides.

## Step 4: Create and Use a Context

**Create a context:**
```bash
meroctl --node-name node1 context create \
  --application-id <APP_ID>
```

**Call methods:**
```bash
# Call a mutation
meroctl --node-name node1 call \
  --context-id <CONTEXT_ID> \
  --method add_item \
  --args '{"key": "hello", "value": "world"}' \
  --executor-public-key <YOUR_KEY>

# Call a view
meroctl --node-name node1 call \
  --context-id <CONTEXT_ID> \
  --method get_item \
  --args '{"key": "hello"}'
```

See [Contexts](../core-concepts/contexts.md) for context management details.

## Step 5: Explore Examples

### Core Examples

Examples in [`core/apps`](https://github.com/calimero-network/core/tree/master/apps):

- **kv-store** - Simple key-value store (great for learning basics)
- **blobs** - File/blob sharing with content addressing
- **collaborative-editor** - Text collaboration with RGA CRDT
- **private-data** - Private storage patterns
- **team-metrics** - Nested CRDT structures
- **xcall-example** - Cross-context communication

**Run an example:**
```bash
cd core/apps/kv-store
./build.sh
meroctl --node-name node1 app install --path build/kv_store.wasm
```

### Application Examples

- **Battleships** - Multiplayer game with real-time sync
- **Shared Todo** - Collaborative task list
- **KV Store** - Boilerplate template application

See [Examples](../examples/index.md) for complete list.

## What's Next?

### For Builders

- **[Core Concepts](../core-concepts/index.md)** - Deep dive into architecture, contexts, identity
- **[Rust SDK Guide](../builder-directory/sdk-guide.md)** - Complete Rust development guide
- **[JavaScript SDK Guide](../builder-directory/js-sdk-guide.md)** - JavaScript/TypeScript development
- **[Examples](../examples/core-apps-examples.md)** - Working example applications

### For Operators

- **[Running Nodes](../operator-track/run-a-local-network.md)** - Node setup and management
- **[Monitoring](../operator-track/monitor-and-debug.md)** - Observability and troubleshooting
- **[meroctl CLI](../tools-apis/meroctl-cli.md)** - Command-line reference

### For Everyone

- **[Architecture Overview](../core-concepts/architecture.md)** - How Calimero works
- **[Tools & APIs](../tools-apis/index.md)** - SDKs, CLI, developer tools

## Common Questions

**Q: Do I need to run my own node?**  
A: For local development, yes. Use `merobox` to run nodes locally. For production, you can use hosted nodes or run your own.

**Q: Which language should I use?**  
A: Applications can be written in Rust (compiled to WASM) or JavaScript/TypeScript (using `@calimero/sdk`). Clients can use JavaScript/TypeScript or Python.

**Q: How do I handle authentication?**  
A: Calimero supports wallet-based authentication (NEAR, Ethereum, ICP). See [Identity](../core-concepts/identity.md) and [Client SDKs](../tools-apis/client-sdks.md).

**Q: Can I use this offline?**  
A: Yes! Calimero is offline-first. Apps work offline and sync when online.

## Getting Help

- **Discord**: [Join our community](https://discord.gg/wZRC73DVpU)
- **GitHub Issues**: [Report bugs or ask questions](https://github.com/calimero-network/core/issues)
- **Documentation**: Browse the docs for detailed guides
