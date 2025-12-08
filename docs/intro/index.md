# Introduction to Calimero

## What is Calimero?

**Calimero** is a peer-to-peer framework for building self-sovereign, local-first applications with automatic, conflict-free synchronization. It enables developers to create distributed apps where users own their data, operate offline, and sync with peers when connectivity is available—without relying on centralized servers.

At the application layer, Calimero provides a shared environment for collaboration, computation, and coordination between peers. Instead of relying on **global consensus** like blockchains do, it achieves distributed consistency through **CRDTs (Conflict-free Replicated Data Types)**—allowing independent nodes to converge on the same state without coordination, leaders, or ordering guarantees.

## Core Value Proposition

| Feature | What it means |
| --- | --- |
| **CRDT-based Sync** | Automatic conflict resolution without coordination |
| **Offline-first** | Works without connectivity, syncs when online |
| **Event-driven** | Real-time notifications across nodes |
| **WASM Runtime** | Write apps in Rust, run in sandboxed environment |
| **Multi-chain** | Integrates with NEAR, ICP, Ethereum, Stellar |

## Key Design Principles

1. **Data Ownership** - Your data on your devices, you control access
2. **Privacy by Default** - End-to-end encryption
3. **Distributed by Design** - P2P architecture, no single point of failure
4. **Developer-Friendly** - Simple API with powerful CRDT primitives

## What Makes Calimero Unique?

Calimero combines several powerful technologies to deliver a unique distributed computing platform:

- **Automatic conflict resolution** via CRDTs — no manual merge code needed. Write natural code with nested data structures; the storage layer handles synchronization automatically.
- **Causal ordering** via DAG — handles out-of-order network delivery gracefully. Deltas can arrive in any order; the system buffers and applies them in correct causal sequence.
- **Dual sync strategy** — fast broadcast (~100-200ms) + reliable catch-up. [Gossipsub](https://docs.rs/gossipsub/latest/gossipsub/){:target="_blank"} provides real-time propagation, while periodic P2P sync ensures eventual consistency even after network issues.
- **Event-driven architecture** — real-time updates without polling. Applications emit events that automatically propagate to all peers and trigger handlers.
- **Local-first** — data owned by users, no central authority required. Your data lives on your devices; you control access and sharing.

## Use Cases

Calimero enables a wide range of decentralized applications:

| Use Case | Why Calimero? |
| --- | --- |
| **Collaborative Editing** | Real-time document collaboration without servers. Multiple users edit simultaneously; conflicts resolve automatically via CRDTs. |
| **Decentralized Social** | User-controlled social networks. Each user runs their own node; data ownership and privacy by default. |
| **P2P Gaming** | Multiplayer games with automatic state sync. Game state synchronizes across players even with network interruptions. |
| **[IoT Networks](https://en.wikipedia.org/wiki/Internet_of_things){:target="_blank"}** | Decentralized device coordination. Devices coordinate without central servers; works offline and syncs when online. |
| **Supply Chain** | Transparent, multi-party tracking. All participants maintain their own copy; automatic conflict resolution handles concurrent updates. |
| **Healthcare** | Private, patient-controlled medical records. Patients own their data; selective sharing with healthcare providers via encrypted contexts. |

See [Example Applications](../examples/index.md) for working implementations.

## Performance Characteristics

- **Latency**: 100-200ms delta propagation (Gossipsub)
- **Throughput**: 100-1000 deltas/sec per context
- **Memory**: ~10MB per context (1000 deltas)
- **Scalability**: Horizontal (more contexts = more throughput)

## Where to Start

| If you are… | Start here |
| --- | --- |
| **Building apps** | [Getting Started](../getting-started/index.md) → [`core/crates/sdk/README.md`](https://github.com/calimero-network/core/blob/master/crates/sdk/README.md){:target="_blank"} |
| **Running nodes** | [Run a Local Network](../operator-track/run-a-local-network.md) → [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md){:target="_blank"} |
| **Understanding sync** | [Architecture Overview](../core-concepts/architecture.md) → [`core/crates/dag/README.md`](https://github.com/calimero-network/core/blob/master/crates/dag/README.md){:target="_blank"} |
| **Debugging issues** | [Monitor & Debug](../operator-track/monitor-and-debug.md) → [`core/crates/node/readme/troubleshooting.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/troubleshooting.md){:target="_blank"} |

## Core Architecture Layers

Calimero's architecture consists of four main layers:

### 1. Application Layer
- WASM apps using the Calimero SDK
- CRDT collections: `UnorderedMap`, `Vector`, `Counter`, `LwwRegister`
- Event emission for real-time updates

**Documentation**: [Applications](../core-concepts/applications.md) → [`core/crates/sdk/README.md`](https://github.com/calimero-network/core/blob/master/crates/sdk/README.md){:target="_blank"}

### 2. Node Layer
- Orchestrates synchronization and execution
- Dual sync paths: Gossipsub (~100-200ms) + Periodic P2P (every 10-30s)
- Event handler execution across the network
- Blob distribution for file sharing

**Documentation**: [Nodes](../core-concepts/nodes.md) → [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md){:target="_blank"}

### 3. Storage Layer
- CRDT storage with automatic merging
- DAG (Directed Acyclic Graph) for causal ordering
- Handles out-of-order delivery with dependency resolution
- [Merkle trees](https://en.wikipedia.org/wiki/Merkle_tree){:target="_blank"} for efficient state comparison

**Documentation**: [Architecture Overview](../core-concepts/architecture.md) → [`core/crates/storage/README.md`](https://github.com/calimero-network/core/blob/master/crates/storage/README.md){:target="_blank"}

### 4. Network Layer
- libp2p-based P2P (Gossipsub, reliable streams, DHT discovery)
- [JSON-RPC](https://www.jsonrpc.org/){:target="_blank"} server for client interaction
- [WebSocket](https://en.wikipedia.org/wiki/WebSocket){:target="_blank"}/[SSE](https://en.wikipedia.org/wiki/Server-sent_events){:target="_blank"} for real-time subscriptions
- Authentication and authorization

**Documentation**: [Reference](../reference/index.md) → [`core/crates/network/README.md`](https://github.com/calimero-network/core/blob/master/crates/network/README.md){:target="_blank"}

## How It Works (Transaction Flow)

1. **Client calls WASM method** via JSON-RPC
2. **WASM executes**, generates CRDT actions (inserts, increments, etc.)
3. **Actions committed** as DAG delta with causal parents
4. **Delta broadcast** via Gossipsub to all peers (~100-200ms)
5. **Peers receive delta**, check if parents are ready
6. **If ready**: apply immediately and execute event handlers
7. **If not ready**: buffer until parents arrive (DAG handles this automatically)
8. **Periodic P2P sync** ensures eventual consistency

For detailed flow diagrams, see [Architecture Overview](../core-concepts/architecture.md).

## Core Repository Structure {#core-architecture-snapshot}

The Calimero Core repository (`calimero-network/core`) contains the runtime and all supporting infrastructure:

```
core/
├── crates/          # Core Rust libraries (30+ crates)
│   ├── sdk/         # Application SDK - macros, CRDT collections, event emission
│   ├── runtime/    # WASM execution engine (Wasmer), sandboxing, resource limits
│   ├── storage/    # CRDT storage layer - collections with merge semantics
│   ├── dag/        # DAG logic (pure) - causal delta tracking, dependency resolution
│   ├── node/       # Node runtime - orchestrates sync, events, blob sharing
│   ├── network/     # P2P networking - libp2p integration (Gossipsub, streams, DHT)
│   ├── server/     # JSON-RPC server - API, WebSocket/SSE subscriptions, admin endpoints
│   ├── auth/       # Authentication - identity management, JWT tokens
│   ├── store/      # Persistent storage backend (RocksDB)
│   ├── context/    # Context lifecycle management (application instances)
│   ├── merod/      # Node binary (coordinator or peer)
│   └── meroctl/    # CLI tool - node operations, app installation, method calls
├── apps/            # Example applications
│   ├── kv-store/    # Simple key-value store
│   ├── blobs/       # Blob sharing example
│   └── ...          # More examples
├── contracts/       # Cross-chain smart contracts
│   ├── near/        # NEAR Protocol contracts
│   ├── icp/         # Internet Computer Protocol canisters
│   ├── ethereum/    # Solidity contracts
│   └── stellar/     # Stellar contracts
└── e2e-tests/       # End-to-end test suite
```

For detailed component explanations, see [Architecture Overview](../core-concepts/architecture.md#key-components).

## Next Steps

- **New to Calimero?** → [Getting Started](../getting-started/index.md)
- **Ready to build?** → [Builder Directory](../builder-directory/index.md)
- **Want to learn?** → [Core Concepts](../core-concepts/index.md)
- **Need to operate?** → [Operator Track](../operator-track/index.md)

---

**Built by the Calimero Network team**

For questions, reach out on [Discord](https://discord.gg/wZRC73DVpU){:target="_blank"}, [GitHub Issues](https://github.com/calimero-network/core/issues){:target="_blank"}, or email [support@calimero.network](mailto:support@calimero.network){:target="_blank"}.

