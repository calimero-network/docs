# Run a Local Network

Quick guide to running Calimero nodes locally for development and testing.

## Using Merobox (Recommended)

Merobox is the easiest way to run local networks. See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme) for complete documentation.

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

For more control, run nodes directly:

```bash
# Install merod
cargo install --path core/crates/merod

# Start coordinator
merobox run --name node1

# Start peer
merobox run --name node2
```

See [`core/crates/merod/README.md`](https://github.com/calimero-network/core/blob/master/crates/merod/README.md) for node options.

## Requirements

- Docker 20.10+ (for Merobox)
- Rust toolchain (if building from source)
- Python 3.8+ (for Merobox)

## Next Steps

- [Monitor & Debug](monitor-and-debug.md) - Observability and troubleshooting
- [Developer Tools](../tools-apis/developer-tools.md) - Merobox, ABI codegen, scaffolding
