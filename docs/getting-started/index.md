# Getting Started

Welcome to Calimero! This guide will help you get up and running quickly, whether you're building applications, running nodes, or just exploring the platform.

## Quick Start Paths

Choose your path based on what you want to do:

| Goal | Path | Time |
| --- | --- | --- |
| **Run a local network** | [Installation Checklist](installation-checklist.md) → [Launch Your First Context](launch-your-first-context.md) | 10 min |
| **Build an application** | [Installation Checklist](installation-checklist.md) → [Build Your First Application](build-your-first-application.md) | 30 min |
| **Explore examples** | [Sample App Walkthrough](sample-app-walkthrough.md) | 15 min |

## Step 1: Installation Checklist

Before you begin, ensure you have the required tools installed:

**Required:**
- Docker (for running nodes)
- Node.js 18+ (for client SDKs)
- Rust toolchain (for building applications)

**Optional but recommended:**
- `merobox` (Python CLI for local development)
- `merod` and `meroctl` (if building from source)

[View full checklist →](installation-checklist.md)

## Step 2: Launch Your First Context

Once you have the tools installed, launch a local network and create your first context:

**Using Merobox (recommended):**
```bash
# Install merobox
pipx install merobox

# Start local network
merobox run --count 2

# Create context (via workflow or CLI)
meroctl context create --application-id <APP_ID>
```

**Using Docker directly:**
```bash
# Start coordinator node
docker run calimero/merod --node-type coordinator

# Start peer node
docker run calimero/merod --node-type peer --swarm-addrs /ip4/127.0.0.1/tcp/2428
```

[Detailed guide →](launch-your-first-context.md)

## Step 3: Build Your First Application

Now that you have a network running, build a simple application:

**Quick start:**
```bash
# Clone example
git clone https://github.com/calimero-network/core
cd core/apps/kv-store

# Build WASM
./build.sh

# Install on node
meroctl app install --path build/kv_store.wasm --context-id <CONTEXT_ID>
```

**From scratch:**
1. Create new Rust project
2. Add Calimero SDK dependencies
3. Define state with `#[app::state]`
4. Implement logic with `#[app::logic]`
5. Build to WASM
6. Install on node

[Detailed guide →](build-your-first-application.md)

## Step 4: Explore Examples

Learn from working examples:

- **kv-store**: Simple key-value store - great for understanding basics
- **battleships**: Multiplayer game - demonstrates real-time sync
- **blobs**: File sharing - shows blob distribution

[Walkthrough →](sample-app-walkthrough.md)

## What's Next?

After completing the getting started guide:

### For Builders

- **[Core Concepts](../core-concepts/index.md)** - Deep dive into architecture
- **[Builder Directory](../builder-directory/index.md)** - Development resources
- **[Examples](../examples/index.md)** - More example applications
- **[Tools & APIs](../tools-apis/index.md)** - SDKs and tooling

### For Operators

- **[Operator Track](../operator-track/index.md)** - Running and managing nodes
- **[Reference](../reference/index.md)** - API documentation
- **[Monitor & Debug](../operator-track/monitor-and-debug.md)** - Observability

### For Everyone

- **[Architecture Overview](../core-concepts/architecture.md)** - How it all works
- **[Privacy & Security](../privacy-verifiability-security/index.md)** - Security model
- **[Support](../support/index.md)** - Get help and contribute

## Common Questions

**Q: Do I need to run my own node?**  
A: For local development, yes. For production, you can use hosted nodes or run your own.

**Q: Which language should I use?**  
A: Applications are written in Rust (compiled to WASM). Clients can use JavaScript/TypeScript or Python.

**Q: How do I handle authentication?**  
A: Calimero supports wallet-based authentication (NEAR, Ethereum, ICP). See [Identity](../core-concepts/identity.md).

**Q: Can I use this offline?**  
A: Yes! Calimero is offline-first. Apps work offline and sync when online.

## Getting Help

- **Discord**: [Join our community](https://discord.gg/wZRC73DVpU)
- **GitHub Issues**: [Report bugs or ask questions](https://github.com/calimero-network/core/issues)
- **Documentation**: Browse the docs for detailed guides

---

**Ready to start?** Begin with the [Installation Checklist](installation-checklist.md)!
