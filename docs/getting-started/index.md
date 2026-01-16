# Getting Started

Welcome to Calimero!
This short guide shows you how to install and run a Calimero node (Merod), build an example application, and deploy and test it on your node.

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
### Install merod and meroctl *(Optional)*
```bash
$: brew install merod
> ==> Fetching downloads for: merod
> ✔︎ Formula merod (0.10.0-rc.32)                                                                                                     > Verified     11.2MB/ 11.2MB
> ==> Installing merod from calimero-network/tap
> 🍺  /opt/homebrew/Cellar/merod/0.10.0-rc.32: 4 files, 8.0MB, built in 1 second
> ==> Running `brew cleanup merod`...
> Disable this behaviour by setting `HOMEBREW_NO_INSTALL_CLEANUP=1`.
> Hide these hints with `HOMEBREW_NO_ENV_HINTS=1` (see `man brew`).

$: merod --version
> merod (release 0.10.0-rc.32) (build f69f6b6) (commit f69f6b6) (rustc 1.88.0)

$: brew install meroctl
> ==> Fetching downloads for: meroctl
> ✔︎ Formula meroctl (0.10.0-rc.32)                                                                                                   Verified      > 4.1MB/  4.1MB
> ==> Installing meroctl from calimero-network/tap
> 🍺  /opt/homebrew/Cellar/meroctl/0.10.0-rc.32: 4 files, 8.0MB, built in 1 second
> ==> Running `brew cleanup meroctl`...
> Disable this behaviour by setting `HOMEBREW_NO_INSTALL_CLEANUP=1`.
> Hide these hints with `HOMEBREW_NO_ENV_HINTS=1` (see `man brew`).

$: meroctl --version
> meroctl (release 0.10.0-rc.32) (build f69f6b6) (commit f69f6b6) (rustc 1.88.0)
```

### Install Merobox

Merobox is the easiest way to run Calimero nodes for local development:

```bash
# Using pipx (recommended)
$: pipx --version
> 1.7.1

$: pipx install merobox
> Installing to existing venv 'merobox'
>  installed package merobox 0.2.13, installed using Python 3.13.3
>  These apps are now globally available:  merobox
> done! ✨ 🌟 ✨

# Or on macOS with Homebrew
$: brew install calimero-network/tap/merobox
> ...
> 🍺  /opt/homebrew/Cellar/merobox/0.1.23: 4 files, 15.6MB, built in 0 seconds
> ==> Running `brew cleanup merobox`...

# Verify installation
$: merobox --version
> merobox, version 0.2.16
```

### Install Rust Toolchain (for building applications)

```bash
# Install Rust
$: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
> info: downloading installer
> ...
> Rust is installed now. Great!

# Add WASM target
$: rustup target add wasm32-unknown-unknown
> ...
> info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date

# Verify installation
$: cargo --version
> cargo 1.92.0 (344c4567c 2025-10-21)
$: rustc --version
> rustc 1.92.0 (ded5c06cf 2025-12-08)
```

### Install Node.js SDKs (for client development)

```bash
# Install Calimero JavaScript SDK
$: npm install @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
> ...
> added 213 packages in 2m
> 12 packages are looking for funding
>  run `npm fund` for details

# Or with pnpm
$: pnpm add @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
> ...
> dependencies:
> + @calimero-network/calimero-cli-js 0.2.0
> + @calimero-network/calimero-sdk-js 0.2.1

> Done in 2m 29.8s
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
> ...
> Deployment Summary: 2/2 nodes started successfully

# Check status
$: merobox list
>                              Running Calimero Nodes                             
> ┏━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┓
> ┃           ┃         ┃           ┃          ┃ RPC/Adm… ┃           ┃          ┃
> ┃ Name      ┃ Status  ┃ Image     ┃ P2P Port ┃ Port     ┃ Chain ID  ┃ Created  ┃
> ┡━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━┩
> │ calimero… │ running │ ghcr.io/… │ 2429     │ 2529     │ testnet-1 │ 2026-01… │
> │           │         │           │          │          │           │ 15:04:32 │
> │ calimero… │ running │ ghcr.io/… │ 2428     │ 2528     │ testnet-1 │ 2026-01… │
> │           │         │           │          │          │           │ 15:04:28 │
> └───────────┴─────────┴───────────┴──────────┴──────────┴───────────┴──────────┘

>                           Running Auth Infrastructure                           
> ┏━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
> ┃ Service     ┃ Status  ┃ Image       ┃ Ports       ┃ Networks    ┃ Created    ┃
> ┡━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
> │ Auth        │ running │ ghcr.io/ca… │ 3001/tcp    │ calimero_i… │ 2026-01-07 │
> │ Service     │         │             │             │ calimero_w… │ 17:33:33   │
> │ Traefik     │ running │ traefik:v2… │ 80:80/tcp,  │ calimero_w… │ 2026-01-07 │
> │ Proxy       │         │             │ 8080:8080/… │             │ 17:33:16   │
> └─────────────┴─────────┴─────────────┴─────────────┴─────────────┴────────────┘
> Auth Data Volume: calimero_auth_data (created: 2025-12-05T12:10:52)

# View logs
$: merobox logs calimero-node-1 --follow
> ...
> [2mlibp2p_ping::handler[0m[2m:[0m ping succeeded [3mrtt[0m[2m=[0m41.628459ms
> 2026-01-12T15:05:40.468844633Z [2m2026-01-12T15:05:40.468600Z[0m [34mDEBUG[0m  [2mcalimero_network::handlers::stream::swarm::ping[0m[2m:[0m
> \x1b[33mping\x1b[39m: Event { peer: PeerId("12D3KooWDm8a27m5HA8jJYGNKA2iZt8YSYHyM6s3aNHhuXLPspiR"), connection: ConnectionId(86), result: 
> Ok(41.628459ms) }
```


### Using merod
```bash
$: merod --node-name node1 init
> 2025-12-16T11:47:34.861762Z  INFO merod::cli::init: Generated identity: PeerId("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:47:34.870745Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"

$: merod --node-name node1 run
...
2025-12-16T11:49:59.649884Z  INFO calimero_server::admin::service: Admin Dashboard UI available on /ip6/::1/tcp/2528/http{/admin-dashboard}
```

See [Running Nodes](../operator-track/run-a-local-network.md) for detailed node management.

## Step 3: Build Your First Application

Calimero applications consist of two parts: `frontend logic` and `backend logic`.

The frontend logic can be written in any frontend language and must include the `calimero-client` dependency, which handles user authentication and JSON-RPC requests to the node.

The backend logic is the core of a Calimero application. It can be written in Rust or JavaScript and is compiled into WebAssembly (WASM) using `calimero-sdk-rs` or `calimero-sdk-js`. This WASM module is then installed on a node, where its logic (mutate and query methods) is executed. Data storage is handled by RocksDB, while CRDTs are responsible for keeping data persistent and synchronized across nodes.

### Option A: Create from Template

```bash
# Create a new application
$: npx create-mero-app my-first-app
> Cloning into /var/folders/p2/_b7fvy792s3458_0jlf6r0jm0000gn/T/mero-create-Gi2ZvC/> repo...
> Done.

> Next steps:
>  cd my-app
>  pnpm install
>  pnpm dev

# Navigate to project
$: cd my-first-app

# Install dependencies
$: pnpm install
> ...
> Progress: resolved 152, reused 152, downloaded 0, added 152, done

> dependencies:
> ...

> devDependencies:
> ...

# Build Rust backend
$: pnpm run logic:build
> ...
> Finished `app-release` profile [optimized] target(s) in 14.04s

# This creates:
# - logic/build/my_first_app.wasm: The compiled WebAssembly binary that contains your application's business logic. This is installed on Calimero nodes (merod) where the WASM code is executed.
# - logic/build/my_first_app.abi.json: The Application Binary Interface (ABI) file that defines your application's API structure, including available functions, parameters, and return types. Used by client SDKs to generate type-safe interfaces for frontend integration.
```

### Option B: Build from Core Examples

For this, we will use the same key-value (KV) store example, but you can explore other available applications in the core repository.

```bash
# Clone core repository
$: git clone https://github.com/calimero-network/core
> Cloning into 'core'...
> ...
> Resolving deltas: 100% (16148/16148), done.
$: cd core/apps/kv-store

# Build WASM
$: ./build.sh
> ...
> Finished `app-release` profile [optimized] target(s) in 14.04s
```

### Option C: Build from Scratch

**1. Create Rust project:**
```bash
$: cargo new --lib my-app
>     Creating library `my-app` package
> note: see more `Cargo.toml` keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
$: cd my-app
```

**2. Add dependencies and update `Cargo.toml`:**
```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
calimero-sdk = { git = "https://github.com/calimero-network/core", branch = "master" }
calimero-storage = { git = "https://github.com/calimero-network/core", branch = "master" }

[build-dependencies]
calimero-wasm-abi = { git = "https://github.com/calimero-network/core", branch = "master" }
serde_json = "1.0.113"

[profile.app-release]
inherits = "release"
opt-level = "z"
lto = true
codegen-units = 1
strip = true

[profile.app-profiling]
inherits = "release"
debug = true
```

**3. Write your application in `src/lib.rs`:**
```rust
use calimero_sdk::app;
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_storage::collections::{LwwRegister, UnorderedMap};

#[app::state]
#[derive(Debug, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct MyApp {
    items: UnorderedMap<String, LwwRegister<String>>,
}

#[app::logic]
impl MyApp {
    #[app::init]
    pub fn init() -> MyApp {
        MyApp {
            items: UnorderedMap::new(),
        }
    }

    pub fn add_item(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key, value.into())?;

        Ok(())
    }

    pub fn get_item(&self, key: &str) -> app::Result<Option<String>> {
        Ok(self.items.get(key)?.map(|v| v.get().clone()))
    }
}
```
**4. Add custom build.rs file and build.sh script**
```rust
// build.rs
use std::fs;
use std::path::Path;

use calimero_wasm_abi::emitter::emit_manifest;

fn main() {
    println!("cargo:rerun-if-changed=src/lib.rs");

    // Parse the source code
    let src_path = Path::new("src/lib.rs");
    let src_content = fs::read_to_string(src_path).expect("Failed to read src/lib.rs");

    // Generate ABI manifest using the emitter
    let manifest = emit_manifest(&src_content).expect("Failed to emit ABI manifest");

    // Serialize the manifest to JSON
    let json = serde_json::to_string_pretty(&manifest).expect("Failed to serialize manifest");

    // Write the ABI JSON to the res directory
    let res_dir = Path::new("res");
    if !res_dir.exists() {
        fs::create_dir_all(res_dir).expect("Failed to create res directory");
    }

    let abi_path = res_dir.join("abi.json");
    fs::write(&abi_path, json).expect("Failed to write ABI JSON");

    // Extract and write the state schema
    if let Ok(mut state_schema) = manifest.extract_state_schema() {
        state_schema.schema_version = "wasm-abi/1".to_owned();

        let state_schema_json =
            serde_json::to_string_pretty(&state_schema).expect("Failed to serialize state schema");
        let state_schema_path = res_dir.join("state-schema.json");
        fs::write(&state_schema_path, state_schema_json)
            .expect("Failed to write state schema JSON");
    }
}
```

```bash
# build.sh
#!/bin/bash
set -e

cd "$(dirname $0)"

TARGET="${CARGO_TARGET_DIR:-target}"

rustup target add wasm32-unknown-unknown

mkdir -p res

# Use app-profiling profile when WASM_PROFILING is set to preserve function names
if [ "${WASM_PROFILING:-false}" = "true" ]; then
    echo "Building with profiling profile "
    PROFILE="app-profiling"
else
    PROFILE="app-release"
fi

RUSTFLAGS="--remap-path-prefix $HOME=~" cargo build --target wasm32-unknown-unknown --profile "$PROFILE"

cp $TARGET/wasm32-unknown-unknown/$PROFILE/my_app.wasm ./res/

# Skip wasm-opt for profiling builds to preserve debug info
if [ "$PROFILE" = "app-release" ] && command -v wasm-opt > /dev/null; then
  wasm-opt -Oz ./res/my_app.wasm -o ./res/my_app.wasm
fi

```

**5. Build WASM by using custom script:**
```bash
$: chmod +x build.sh && ./build.sh
```

## Step 4: Install application on the node
> **NOTE**: If you followed the setup with merobox continue with the merobox commands. By using merobox start command you will have a node with id `calimero-node-1` running.
> If you used merod to initialize and run the node it will have the node id you selected while running the command.
> If you used default commands from this tutorial you will have node with id `node1` running.

```bash
# Install my_app or kv_store; configure path accordingly
# Using Merobox
$:  merobox install --node calimero-node-1 --dev --path res/my_app.wasm
> ✓ Application installed successfully!

# Using meroctl (for nodes started with merod tool)
$: meroctl --node node1 app install --path res/my_store.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯
```

See [SDK Guide](../builder-directory/sdk-guide.md) or [JavaScript SDK Guide](../builder-directory/js-sdk-guide.md) for detailed development guides.

## Step 5: Create Context and call mutate and view methods

To understand what contexts are and how they work read [here](../core-concepts/contexts.md) for more.

**Create a context:**
```bash
# Meroctl command for creating contexts
$: meroctl --node <NODE_ID> context create \
 --protocol <PROTOCOL> --application-id <APP_ID>

# Creating context with application ID from previous steps using NEAR protocol
$: meroctl --node node1 context create \
  --protocol near --application-id A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo
> +------------------------------+
> | Context Created              |
> +==============================+
> | Successfully created context |
> +------------------------------+

# Meroctl command to view created context data
$: meroctl --node node1 context ls
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+
> | Context ID                                   | Application ID                               | Root Hash                                            |
> +====================================================================================================================================================+
> | H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak | A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo | Hash("2NxXdVKqeMU7S957bitBfeTzWPZXPvyUN2VhgjwNn4Yn") |
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+

# Meroctl command for viewing context identity
$: meroctl --node <NODE_ID> context identity list --context <CONTEXT_ID>

$: meroctl --node node1 context identity list --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak
> +----------------------------------------------+------------------+
> | Identity                                     | Type             |
> +=================================================================+
> | FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS | Context Identity |
> +----------------------------------------------+------------------+
```

**Call methods:**
```bash
# Meroctl - call a mutation command
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON> \
  --as <IDENTITY_PUBLIC_KEY>

# Command with values from previous steps
$: meroctl --node node1 call add_item \
 --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
 --args '{"key": "hello", "value": "world"}' \
 --as FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS
> 🔍 JSON-RPC Request to http://127.0.0.1:2528/jsonrpc: {
> ...
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+

# Meroctl - call a view command
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON> \
  --as <IDENTITY_PUBLIC_KEY>

# Command with values from previous steps
$: meroctl --node node1 call get_item \
  --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
  --args '{"key": "hello"}' \
  --as FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS
> 🔍 meroctl call output: {
>   jsonrpc: 2.0,
>   id: null,
>   result: {
>     output: world
>   }
> }
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+
  
```

As this is the final step of this guide, let’s recap what we accomplished:
 
 1. Installed the Calimero tooling: Merobox or merod and meroctl.
 
 2. Initialized and started nodes using Merobox (recommended for local development) or merod.
 
 3. Walked through writing and building a Rust application for Calimero—either by compiling an existing example or recreating one from scratch.
 
 4. Installed the application WASM on the node using Merobox or meroctl.
 
 5. Created a context for the installed application on the NEAR Protocol to store its configuration using Merobox or meroctl.
 
 6. Invoked a change method using Merobox or meroctl to save a key–value pair, then used a view method to verify that the data was saved >correctly.


See [Contexts](../core-concepts/contexts.md) for context management details.

## Step 6: Explore Examples

### Core Examples

Examples in [`core/apps`](https://github.com/calimero-network/core/tree/master/apps){:target="_blank"}:

- **kv-store** - Simple key-value store (great for learning basics)
- **blobs** - File/blob sharing with content addressing
- **collaborative-editor** - Text collaboration with RGA CRDT
- **private-data** - Private storage patterns
- **team-metrics** - Nested CRDT structures
- **xcall-example** - Cross-context communication
... and many more

**Run an example:**
```bash
$: cd core/apps/kv-store
$: ./build.sh
...
 calimero-storage` to apply 1 suggestion)
    Finished `app-release` profile [optimized] target(s) in 18.11s
$: meroctl --node node1 app install --path res/kv_store.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯
> ...

```

### Application Examples

- **Curb** - Modern multi channel chat application
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
A: For local development, yes. Use `merobox` to run nodes locally. For production, you can use hosted nodes or run your own by using merod and meroctl setup.

**Q: Which language should I use?**  
A: Applications can be written in Rust (compiled to WASM) or JavaScript/TypeScript (using `@calimero-network/calimero-sdk-js`). Clients can use JavaScript/TypeScript or Python.

**Q: How do I handle authentication?**  
A: Calimero supports User/Password and NEAR wallet-based authentication. See [Identity](../core-concepts/identity.md) and [Client SDKs](../tools-apis/client-sdks.md).

**Q: Can I use this offline?**  
A: Yes! Calimero is offline-first. Apps work offline and sync when online.
