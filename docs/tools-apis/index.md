# Tools and APIs

A comprehensive overview of the core tools and APIs in the Calimero ecosystem. Each tool serves a specific purpose in building, deploying, and managing Calimero applications.

---

## merod

**Calimero Node Daemon**

The core node implementation that powers the Calimero network. `merod` is the runtime daemon that manages peer-to-peer connections, application contexts, and CRDT-based state synchronization.

**Key Features:**
- P2P networking and peer discovery
- Context management and isolation
- CRDT-based state replication
- WebAssembly application runtime
- Built-in RPC server

👉 [View merod on GitHub](https://github.com/calimero-network/core)

---

## meroctl

**Calimero Command-Line Interface**

The primary CLI tool for interacting with Calimero nodes. Use `meroctl` to manage contexts, deploy applications, and configure your node.

**Key Features:**
- Context creation and management
- Application deployment and updates
- Node configuration and monitoring
- Identity and key management
- RPC client for node communication

👉 [View meroctl on GitHub](https://github.com/calimero-network/core)

---

## merobox

**Calimero Development Environment**

A containerized development environment that bundles everything you need to run a local Calimero network. Perfect for testing and development.

**Key Features:**
- Pre-configured local node setup
- Hot-reload for rapid development
- Multi-node testing environment
- Isolated development contexts
- Docker-based deployment

👉 [View merobox on GitHub](https://github.com/calimero-network/merobox)

---

## mero-devtools-js

**JavaScript/TypeScript Development Kit**

A comprehensive JavaScript/TypeScript SDK for building Calimero applications. Includes client libraries, type definitions, and development utilities.

**Key Features:**
- TypeScript-first API client
- CRDT state management utilities
- Context and identity management
- WebSocket and RPC communication
- React hooks and utilities

👉 [View mero-devtools-js on GitHub](https://github.com/calimero-network/mero-devtools-js)

---

## Getting Started

1. **Install merod** to run a Calimero node
2. **Use meroctl** to manage your node and deploy applications
3. **Try merobox** for local development and testing
4. **Build with mero-devtools-js** to create JavaScript/TypeScript applications

For detailed setup instructions, refer to each tool's README in its respective repository.




