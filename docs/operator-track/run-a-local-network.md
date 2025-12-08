# Run a Local Network

Quick guide to running Calimero nodes locally for development and testing.

## Using Merobox (Recommended)

Merobox is the easiest way to run local networks. See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme){:target="_blank"} for complete documentation.

**Quick start:**
```bash
# Install merobox
pipx install merobox

# Start 2-node network
merobox run --count 2

# Check status
merobox list
merobox health
```

**With workflow:**
```bash
merobox bootstrap run workflow.yml
```

## Using merod Directly

For more control, run nodes directly without Docker:

```bash
# Install merod (from source)
cargo install --path core/crates/merod

# Or build and use directly
cd core/crates/merod
cargo build --release
```

**Initialize and run a single node:**

```bash
# Initialize a node with default settings
merod --node-name node1 init

# Or with custom ports
merod --node-name node1 init --server-port 2428 --swarm-port 2528

# Run the node
merod --node-name node1 run
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
