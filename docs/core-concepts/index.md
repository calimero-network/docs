# Core Concepts

Understanding Calimero's core concepts is essential for building and operating applications. This section covers the fundamental building blocks of the platform.

## Overview

Calimero consists of several interconnected concepts:

- **[Contexts](contexts.md)** - Isolated application instances with their own state and members
- **[Identity](identity.md)** - Cryptographic identities for access control and authentication
- **[Applications](applications.md)** - WASM modules that run inside contexts
- **[Nodes](nodes.md)** - Runtime that orchestrates synchronization and execution
- **[Architecture Overview](architecture.md)** - How all components work together

## Contexts

**Contexts** are isolated instances of applications running on the Calimero network. Each context has:

- **Isolated State**: Own CRDT-backed state, completely separate from other contexts
- **Member Management**: Invite-only access control with cryptographic identities
- **Lifecycle**: Create, invite, join, and manage independently

**Key concepts:**
- State isolation model (shared CRDT state vs private storage)
- Invitation and membership flow
- Multi-chain integration (NEAR, Ethereum, ICP, etc.)

[Learn more →](contexts.md)

## Identity

**Identity** in Calimero uses cryptographic keys for access control:

- **Root Keys**: Master identities (typically from blockchain wallets)
- **Client Keys**: Derived keys for specific contexts
- **Authentication**: Wallet-based authentication (NEAR, Ethereum, ICP, etc.)

**Key concepts:**
- Hierarchical key management
- Wallet adapters and integration
- JWT tokens for API authentication

[Learn more →](identity.md)

## Applications

**Applications** are WASM modules that run inside contexts:

- **WASM Runtime**: Sandboxed execution environment
- **CRDT State**: Conflict-free data types for automatic synchronization
- **Event System**: Real-time event emission and handling
- **Private Storage**: Node-local data that never leaves the node

**Key concepts:**
- SDK macros (`#[app::state]`, `#[app::logic]`)
- CRDT collections (UnorderedMap, Vector, Counter, etc.)
- Views vs mutations
- ABI generation for client bindings

[Learn more →](applications.md)

## Nodes

**Nodes** (`merod`) orchestrate synchronization and execution:

- **Node Types**: Coordinator (first node) or Peer (joins network)
- **Synchronization**: Dual-path sync (Gossipsub + periodic P2P)
- **Event Handling**: Automatic event handler execution
- **Blob Distribution**: Content-addressed file sharing

**Key concepts:**
- NodeManager architecture
- Delta propagation and application
- Admin surfaces (JSON-RPC, WebSocket, SSE)

[Learn more →](nodes.md)

## Architecture Overview

The **Architecture Overview** explains how all components work together:

- **Four-Layer Architecture**: Application, Node, Storage, Network layers
- **Transaction Flow**: How requests flow through the system
- **Synchronization Flow**: Dual-path sync strategy
- **DAG-Based Ordering**: Causal ordering for out-of-order delivery
- **Component Map**: Detailed breakdown of each crate

[Learn more →](architecture.md)

## How Concepts Relate

```
┌─────────────────────────────────────────────────┐
│ Node (merod)                                    │
│  ┌──────────────────────────────────────────┐  │
│  │ Context A                                  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │ Application (WASM)                 │  │  │
│  │  │  - CRDT State                       │  │  │
│  │  │  - Events                          │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │ Members (Identities)                │  │  │
│  │  │  - Root Key: alice.near            │  │  │
│  │  │  - Client Key: ed25519:abc...      │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │ Context B (separate instance)            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Learning Path

**New to Calimero?** Start here:

1. **[Architecture Overview](architecture.md)** - Understand the big picture
2. **[Applications](applications.md)** - Learn how to build apps
3. **[Contexts](contexts.md)** - Understand application instances
4. **[Identity](identity.md)** - Learn about access control
5. **[Nodes](nodes.md)** - Understand the runtime

**Ready to build?** Check out:

- [Getting Started](../getting-started/index.md) - Step-by-step guides
- [Builder Directory](../builder-directory/index.md) - Development resources
- [Examples](../examples/index.md) - Working applications

**Need to operate?** See:

- [Operator Track](../operator-track/index.md) - Running and managing nodes
- [Reference](../reference/index.md) - API documentation

---

**Next**: Start with [Architecture Overview](architecture.md) to understand how everything fits together.
