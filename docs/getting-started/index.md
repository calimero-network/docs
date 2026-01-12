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

This guide walks you through setting up and running a local network with [merobox](https://pypi.org/project/merobox/). Other installation options—such as using [Homebrew](https://brew.sh/) or building from [source](https://github.com/calimero-network/core)—are also supported and are covered in other sections of the documentation.

### Prerequisites

**Required:**

- **[Docker](https://www.docker.com/){:target="_blank"}** 20.10+ (for running nodes)

- **[Python](https://www.python.org/){:target="_blank"}** 3.8+ (for running merobox)

- **[Pipx](https://github.com/pypa/pipx){:target="_blank"}** 1.7.0+ (for installing merobox)

- **[Node.js](https://nodejs.org/en){:target="_blank"}** 18+ (for client SDKs and building JavaScript apps)

- **[Rust toolchain](https://rust-lang.org/tools/install/){:target="_blank"}** (for building Rust applications)
    - **Cargo** 1.92.0+
    - **Rustup** 1.28.2+
    - **Rustc** 1.92.0+


**Optional:**
- `merod` and `meroctl` (if building from source)

### Install Merobox

Merobox is the easiest way to run local Calimero networks:

```bash
# Using pipx (recommended)
$: pipx --version
1.7.1

$: pipx install merobox
Installing to existing venv 'merobox'
  installed package merobox 0.2.13, installed using Python 3.13.3
  These apps are now globally available:  merobox
done! ✨ 🌟 ✨

# Or on macOS with Homebrew
$: brew install calimero-network/tap/merobox
...
🍺  /opt/homebrew/Cellar/merobox/0.1.23: 4 files, 15.6MB, built in 0 seconds
==> Running `brew cleanup merobox`...

# Verify installation
$: merobox --version
merobox, version 0.2.16
```

### Install Rust Toolchain (for building applications)

```bash
# Install Rust
$: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
info: downloading installer
...
Rust is installed now. Great!
...

# Add WASM target
$: rustup target add wasm32-unknown-unknown
...
info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date

# Verify installation
$: cargo --version
cargo 1.92.0 (344c4567c 2025-10-21)
$: rustc --version
rustc 1.92.0 (ded5c06cf 2025-12-08)
```

### Install Node.js SDKs (for client development)

```bash
# Install Calimero JavaScript SDK
$: npm install @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
...
added 213 packages in 2m
12 packages are looking for funding
  run `npm fund` for details

# Or with pnpm
$: pnpm add @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
...
dependencies:
+ @calimero-network/calimero-cli-js 0.2.0
+ @calimero-network/calimero-sdk-js 0.2.1

Done in 2m 29.8s
```

NPM resources:

- [calimero-sdk-js](https://www.npmjs.com/package/@calimero-network/calimero-sdk-js){:target="_blank"}

- [calimero-cli-js](https://www.npmjs.com/package/@calimero-network/calimero-cli-js){:target="_blank"}

See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme){:target="_blank"} for complete installation options.

## Step 2: Run a Local Network

### Using Merobox (Recommended)

> **Note**: If Docker app is not running you will get the following error:
>
> Failed to connect to Docker: Error while fetching server API version: 
> ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))
> Make sure Docker is running and you have permission to access it.
>
> To fix it you just need to run the Docker app and continue.

```bash
# Start a 2-node network
$: merobox run --count 2
...
Deployment Summary: 2/2 nodes started successfully

# Check status
$: merobox list
                             Running Calimero Nodes                             
┏━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┓
┃           ┃         ┃           ┃          ┃ RPC/Adm… ┃           ┃          ┃
┃ Name      ┃ Status  ┃ Image     ┃ P2P Port ┃ Port     ┃ Chain ID  ┃ Created  ┃
┡━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━┩
│ calimero… │ running │ ghcr.io/… │ 2429     │ 2529     │ testnet-1 │ 2026-01… │
│           │         │           │          │          │           │ 15:04:32 │
│ calimero… │ running │ ghcr.io/… │ 2428     │ 2528     │ testnet-1 │ 2026-01… │
│           │         │           │          │          │           │ 15:04:28 │
└───────────┴─────────┴───────────┴──────────┴──────────┴───────────┴──────────┘

                          Running Auth Infrastructure                           
┏━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Service     ┃ Status  ┃ Image       ┃ Ports       ┃ Networks    ┃ Created    ┃
┡━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ Auth        │ running │ ghcr.io/ca… │ 3001/tcp    │ calimero_i… │ 2026-01-07 │
│ Service     │         │             │             │ calimero_w… │ 17:33:33   │
│ Traefik     │ running │ traefik:v2… │ 80:80/tcp,  │ calimero_w… │ 2026-01-07 │
│ Proxy       │         │             │ 8080:8080/… │             │ 17:33:16   │
└─────────────┴─────────┴─────────────┴─────────────┴─────────────┴────────────┘
Auth Data Volume: calimero_auth_data (created: 2025-12-05T12:10:52)

# View logs
$: merobox logs calimero-node-1 --follow
...
[2mlibp2p_ping::handler[0m[2m:[0m ping succeeded [3mrtt[0m[2m=[0m41.628459ms
2026-01-12T15:05:40.468844633Z [2m2026-01-12T15:05:40.468600Z[0m [34mDEBUG[0m [2mcalimero_network::handlers::stream::swarm::ping[0m[2m:[0m
\x1b[33mping\x1b[39m: Event { peer: PeerId("12D3KooWDm8a27m5HA8jJYGNKA2iZt8YSYHyM6s3aNHhuXLPspiR"), connection: ConnectionId(86), result: 
Ok(41.628459ms) }
```

See [Running Nodes](../operator-track/run-a-local-network.md) for detailed node management.

## Step 3: Build Your First Application

### Option A: Create from Template

```bash
# Create a new application
$: npx create-mero-app my-first-app

# Navigate to project
$: cd my-first-app

# Install dependencies
$: pnpm install

# Build Rust backend
$: pnpm run logic:build

# This creates:
# - logic/build/my_first_app.wasm (WASM binary)
# - logic/build/my_first_app.abi.json (API definition)
```

### Option B: Build from Core Examples

```bash
# Clone core repository
$: git clone https://github.com/calimero-network/core
$: cd core/apps/kv-store

# Build WASM
$: ./build.sh

# Install on node
$: meroctl --node node1 app install \
  --path build/kv_store.wasm
```

### Option C: Build from Scratch

**1. Create Rust project:**
```bash
$: cargo new --lib my-app
$: cd my-app
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
    
    pub fn get_item(&self, key: &str) -> app::Result<Option<String>> {
        self.items.get(key)?.map(|v| v.get().clone())
    }
}
```

**4. Build WASM:**
```bash
$: cargo build --target wasm32-unknown-unknown --release
```

**5. Install on node:**
```bash
$: meroctl --node-name node1 app install \
  --path target/wasm32-unknown-unknown/release/my_app.wasm
```

See [SDK Guide](../builder-directory/sdk-guide.md) or [JavaScript SDK Guide](../builder-directory/js-sdk-guide.md) for detailed development guides.

## Step 4: Create and Use a Context

**Create a context:**
```bash
$: meroctl --node node1 context create \
  --application-id <APP_ID>
```

**Call methods:**
```bash
# Call a mutation
$: meroctl --node node1 call \
  --context-id <CONTEXT_ID> \
  --method add_item \
  --args '{"key": "hello", "value": "world"}' \
  --executor-public-key <YOUR_KEY>

# Call a view
$: meroctl --node node1 call \
  --context-id <CONTEXT_ID> \
  --method get_item \
  --args '{"key": "hello"}'
```

See [Contexts](../core-concepts/contexts.md) for context management details.

## Step 5: Explore Examples

### Core Examples

Examples in [`core/apps`](https://github.com/calimero-network/core/tree/master/apps){:target="_blank"}:

- **kv-store** - Simple key-value store (great for learning basics)
- **blobs** - File/blob sharing with content addressing
- **collaborative-editor** - Text collaboration with RGA CRDT
- **private-data** - Private storage patterns
- **team-metrics** - Nested CRDT structures
- **xcall-example** - Cross-context communication

**Run an example:**
```bash
$: cd core/apps/kv-store
$: ./build.sh
...
 calimero-storage` to apply 1 suggestion)
    Finished `app-release` profile [optimized] target(s) in 18.11s
$: meroctl --node-name node1 app install --path build/kv_store.wasm

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
A: Applications can be written in Rust (compiled to WASM) or JavaScript/TypeScript (using `@calimero-network/calimero-sdk-js`). Clients can use JavaScript/TypeScript or Python.

**Q: How do I handle authentication?**  
A: Calimero supports NEAR wallet-based authentication. See [Identity](../core-concepts/identity.md) and [Client SDKs](../tools-apis/client-sdks.md).

**Q: Can I use this offline?**  
A: Yes! Calimero is offline-first. Apps work offline and sync when online.
