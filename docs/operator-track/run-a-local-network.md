# Run a Local Network

Quick guide to running Calimero nodes locally for development and testing.

## Using Merobox (Recommended)

Merobox is the easiest way to run local networks. See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme){:target="_blank"} for complete documentation.

**Quick start:**
```bash
# Install merobox
$: pipx install merobox
> Installing to existing venv 'merobox'
>  installed package merobox 0.2.13, installed using Python 3.13.3
>  These apps are now globally available:  merobox
> done! ✨ 🌟 ✨

# Start 2-node network
$: merobox run --count 2
> ...
> Deployment Summary: 2/2 nodes started successfully

# Check status
$: merobox list
> ┏━━━━━━━━━━─━┳━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┓
> ┃            ┃         ┃           ┃          ┃ RPC/Adm… ┃           ┃          ┃
> ┃ Name       ┃ Status  ┃ Image     ┃ P2P Port ┃ Port     ┃ Chain ID  ┃ Created  ┃
> ┡━━━━━━━━━━─━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━┩
> │ calimero-… │ running │ ghcr.io/… │ 2429     │ 2529     │ testnet-1 │ 2026-01… │
> │            │         │           │          │          │           │ 14:22:12 │
> ┡━━━━━━━━━━─━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━┩
> │ calimero-… │ running │ ghcr.io/… │ 2427     │ 2527     │ testnet-2 │ 2026-01… │
> │            │         │           │          │          │           │ 14:22:12 │
> └────────────┴─────────┴───────────┴──────────┴──────────┴───────────┴──────────┘

$: merobox health
> Checking health of 1 running node(s)...
>                  Calimero Node Health Status                 
> ╭─────────────────┬────────┬───────────────┬───────┬─────────╮
> │ Node            │ Health │ Authenticated │ Peers │ Status  │
> ├─────────────────┼────────┼───────────────┼───────┼─────────┤
> │ calimero-node-1 │ alive  │ Unknown       │ 0     │ Healthy │
> │ calimero-node-2 │ alive  │ Unknown       │ 0     │ Healthy │
> ╰─────────────────┴────────┴───────────────┴───────┴─────────╯
```

**With workflow:**
```bash
$: merobox bootstrap run workflow.yml
> ...
> 🚀 Executing Workflow: Example Application
> ...
```

## Using merod Directly

For more control, run nodes directly without Docker:

```bash
# Builds your crate and copies the binary into ~/.cargo/bin, so you can run it from anywhere.
$: cargo install --path ./crates/merod
> Installed package merod v0.1.0 (/Users/X/Desktop/core/crates/merod) (executable merod)
$: which merod
> /Users/X/.cargo/bin/merod

# Or
# Builds the binary inside the project only; it's not globally available unless you reference it explicitly.
$: cd crates/merod
$: cargo build --release
> Compiling merod v0.1.0 (/Users/X/Desktop/core/crates/merod)
>     Finished release [optimized + debuginfo] target(s) in 10.35s
> Installing merod v0.1.0 (/Users/X/Desktop/core/crates/merod)
> Installing /Users/X/Desktop/core/crates/merod/target/release/merod (executable)
> Installed package merod v0.1.0 (/Users/X/Desktop/core/crates/merod) (executable merod)
```

**Initialize and run a single node:**

```bash
# Initialize a node with default settings
$: merod --node-name node1 init
> 2025-12-16T11:47:34.861762Z  INFO merod::cli::init: Generated identity: PeerId>("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:47:34.870745Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"

# Or from binary
$: cargo run --bin merod -- --node-name node1 init
> 2025-12-16T11:47:34.861762Z  INFO merod::cli::init: Generated identity: PeerId("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:47:34.870745Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"

# With custom ports:

$: merod --node-name node1 init --server-port 2428 --swarm-port 2528
> 2025-12-16T11:52:13.841762Z  INFO merod::cli::init: Generated identity: PeerId("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:52:13.840725Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"

# Or from binary
$: cargo run --bin merod -- --node-name node1 init --server-port 2428 --swarm-port 2528
> 2025-12-16T11:52:13.841762Z  INFO merod::cli::init: Generated identity: PeerId("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:52:13.840725Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"
```

**Run multiple nodes manually:**

```bash
# Terminal 1: Start first node (coordinator)
merod --node-name node1 init --server-port 2428 --swarm-port 2528
merod --node-name node1 run

# Terminal 2: Start second node (peer)
merod --node-name node2 init --server-port 2429 --swarm-port 2529
merod --node-name node2 config --swarm-addrs /ip4/127.0.0.1/tcp/2528
merod --node-name node2 run

# Terminal 3: Start third node (peer)
merod --node-name node3 init --server-port 2430 --swarm-port 2530
merod --node-name node3 config --swarm-addrs /ip4/127.0.0.1/tcp/2528
merod --node-name node3 run
```

**Configuration:**

```bash
# Configure node settings
merod --node-name node1 config --server-host 0.0.0.0 --server-port 3000
merod --node-name node1 config --swarm-host 0.0.0.0 --swarm-port 2428

# Use custom home directory
merod --home ~/.calimero-custom --node-name node1 init
```

See [`meroctl CLI`](../tools-apis/meroctl-cli.md) for managing contexts and use `merod --help` for all available node options.

## Requirements

- Docker 20.10+ (for Merobox)
- Rust toolchain (if building from source)
- Python 3.8+ (for Merobox)

## Next Steps

- [Monitor & Debug](monitor-and-debug.md) - Observability and troubleshooting
- [Developer Tools](../tools-apis/developer-tools.md) - Merobox, ABI codegen, scaffolding
