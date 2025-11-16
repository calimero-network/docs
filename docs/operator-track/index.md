# Operating Calimero Nodes

Guidance for running and managing Calimero nodes in production.

## Quick Links

| Task | Guide | Repository Docs |
| --- | --- | --- |
| **Local Development** | [Run a Local Network](run-a-local-network.md) | [`merobox/README.md`](https://github.com/calimero-network/merobox#readme) |
| **Monitoring** | [Monitor & Debug](monitor-and-debug.md) | [`core/crates/node/readme/troubleshooting.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/troubleshooting.md) |

## Running Nodes

For complete node documentation, see [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md).

**Quick start:**
```bash
# Install merod
cargo install --path core/crates/merod

# Run coordinator
merod --node-type coordinator

# Run peer
merod --node-type peer --swarm-addrs /ip4/127.0.0.1/tcp/2428
```

**Or use Merobox:**
```bash
merobox run --count 2
```

## Monitoring

See [Monitor & Debug](monitor-and-debug.md) for observability and troubleshooting.
