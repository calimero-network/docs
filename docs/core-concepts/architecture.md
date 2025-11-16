# Architecture Overview

Calimero's architecture consists of four main layers that work together to enable distributed, peer-to-peer applications with automatic conflict-free synchronization.

## Four-Layer Architecture

```mermaid
graph TB
    APP[Application Layer<br/>WASM apps + SDK<br/>CRDT collections<br/>Event emission]
    NODE[Node Layer<br/>Synchronization & execution<br/>Dual sync paths<br/>Event handlers<br/>Blob distribution]
    STORAGE[Storage Layer<br/>CRDT storage<br/>DAG causal ordering<br/>Out-of-order handling<br/>Merkle trees]
    NETWORK[Network Layer<br/>libp2p P2P<br/>JSON-RPC server<br/>WebSocket/SSE<br/>Authentication]
    
    APP -->|executes| NODE
    NODE -->|stores| STORAGE
    STORAGE -->|syncs via| NETWORK
    NETWORK -->|provides| NODE
    
    style APP fill:#e5ffe5,stroke:#000000,stroke-width:3px
    style NODE fill:#ffffff,stroke:#00ff00,stroke-width:3px
    style STORAGE fill:#e5ffe5,stroke:#000000,stroke-width:3px
    style NETWORK fill:#ffffff,stroke:#00ff00,stroke-width:3px
```

## Transaction Flow

**Simple view:**
```mermaid
sequenceDiagram
    Client->>Node: call("add_item", args)
    Node->>WASM: execute()
    WASM->>Storage: CRDT operations
    Storage->>Node: ExecutionOutcome
    Node->>Network: Broadcast delta
    Network->>Peer: Propagate (~100ms)
    Node->>Client: Result
    
    style Client fill:#ffffff,stroke:#000000
    style Node fill:#e5ffe5,stroke:#00ff00
    style WASM fill:#ffffff,stroke:#000000
```

**Detailed execution:**
```mermaid
sequenceDiagram
    WASM->>Storage: map.insert(key, value)
    Storage->>Storage: Generate Action
    Storage->>Storage: Calculate Merkle hash
    Storage->>Storage: Collect in DELTA_CONTEXT
    Storage->>Node: Return ExecutionOutcome
    Node->>DAG: Create CausalDelta
    Node->>Network: Broadcast via Gossipsub
    
    style WASM fill:#ffffff,stroke:#000000
    style Storage fill:#e5ffe5,stroke:#00ff00
    style Node fill:#ffffff,stroke:#00ff00
```

See [`core/crates/runtime/README.md`](https://github.com/calimero-network/core/blob/master/crates/runtime/README.md) for execution details.

## Synchronization Flow

Calimero uses a dual-path synchronization strategy:

### Path 1: Gossipsub Broadcast (Primary)

Fast real-time propagation (~100-200ms):

```mermaid
flowchart LR
    A[Transaction<br/>executed] --> B[Create<br/>CausalDelta]
    B --> C[Broadcast via<br/>Gossipsub]
    C --> D[All peers receive<br/>~100-200ms]
    D --> E{Parents<br/>ready?}
    E -->|Yes| F[Apply<br/>immediately]
    E -->|No| G[Buffer as<br/>pending]
    F --> H[Execute<br/>event handlers]
    
    style A fill:#ffffff,stroke:#000000,stroke-width:2px
    style F fill:#e5ffe5,stroke:#00ff00,stroke-width:3px
    style H fill:#e5ffe5,stroke:#00ff00,stroke-width:2px
    style G fill:#ffffff,stroke:#00ff00,stroke-width:2px
```

### Path 2: Periodic P2P Sync (Fallback)

Catch-up every 10-30 seconds for eventual consistency:

```mermaid
flowchart LR
    T[SyncManager<br/>timer] --> S[Select<br/>random peer]
    S --> O[Open P2P<br/>stream]
    O --> X[Exchange<br/>DAG heads]
    X --> D{Heads<br/>differ?}
    D -->|Yes| R[Request<br/>missing deltas]
    D -->|No| C[Up to date]
    R --> A[Apply<br/>deltas]
    A --> C
    
    style T fill:#ffffff,stroke:#000000,stroke-width:2px
    style C fill:#e5ffe5,stroke:#00ff00,stroke-width:3px
    style A fill:#e5ffe5,stroke:#00ff00,stroke-width:2px
```

**Why both paths?**
- **Gossipsub**: Fast (~100-200ms), reliable in good network conditions
- **Periodic sync**: Ensures eventual consistency even with packet loss, partitions, or downtime

See [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md) for sync configuration details.

## DAG-Based Causal Ordering

The DAG ensures deltas are applied in correct causal order, even when received out-of-order:

```mermaid
graph LR
    ROOT[Delta 0<br/>ROOT] --> A[Delta 1A<br/>Node A]
    ROOT --> B[Delta 1B<br/>Node B]
    A --> MERGE[Delta 2<br/>MERGE]
    B --> MERGE
    
    style ROOT fill:#000000,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style A fill:#ffffff,stroke:#000000,stroke-width:2px
    style B fill:#ffffff,stroke:#000000,stroke-width:2px
    style MERGE fill:#e5ffe5,stroke:#00ff00,stroke-width:3px
```

**Key properties**:
- Deltas can arrive in any order
- System buffers deltas until their parent dependencies are ready
- Once parents are available, deltas are applied automatically in causal order
- Concurrent updates create forks that merge automatically

## Key Components

```mermaid
graph TB
    SDK[SDK<br/>crates/sdk]
    RUNTIME[Runtime<br/>crates/runtime]
    STORAGE[Storage<br/>crates/storage]
    DAG[DAG<br/>crates/dag]
    NODE[Node<br/>crates/node]
    NETWORK[Network<br/>crates/network]
    SERVER[Server<br/>crates/server]
    
    SDK -->|executes via| RUNTIME
    RUNTIME -->|uses| STORAGE
    STORAGE -->|tracks in| DAG
    NODE -->|orchestrates| RUNTIME
    NODE -->|syncs via| NETWORK
    SERVER -->|exposes| NODE
    
    style SDK fill:#e5ffe5,stroke:#000000,stroke-width:2px
    style RUNTIME fill:#ffffff,stroke:#00ff00,stroke-width:2px
    style STORAGE fill:#e5ffe5,stroke:#000000,stroke-width:2px
    style DAG fill:#ffffff,stroke:#00ff00,stroke-width:2px
    style NODE fill:#000000,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style NETWORK fill:#e5ffe5,stroke:#00ff00,stroke-width:2px
    style SERVER fill:#ffffff,stroke:#000000,stroke-width:2px
```

| Component | Purpose | Repository |
| --- | --- | --- |
| **SDK** | `#[app::state]`, `#[app::logic]`, CRDT collections, events | [`core/crates/sdk`](https://github.com/calimero-network/core/blob/master/crates/sdk) |
| **Runtime** | WASM execution (Wasmer), sandboxing | [`core/crates/runtime`](https://github.com/calimero-network/core/blob/master/crates/runtime) |
| **Storage** | CRDT collections, merge semantics | [`core/crates/storage`](https://github.com/calimero-network/core/blob/master/crates/storage) |
| **DAG** | Causal delta tracking, dependency resolution | [`core/crates/dag`](https://github.com/calimero-network/core/blob/master/crates/dag) |
| **Node** | NodeManager orchestrates sync, events, blobs | [`core/crates/node`](https://github.com/calimero-network/core/blob/master/crates/node) |
| **Network** | libp2p P2P (Gossipsub, streams, DHT) | [`core/crates/network`](https://github.com/calimero-network/core/blob/master/crates/network) |
| **Server** | JSON-RPC API, WebSocket/SSE | [`core/crates/server`](https://github.com/calimero-network/core/blob/master/crates/server) |
| **merod** | Node binary (coordinator/peer) | [`core/crates/merod`](https://github.com/calimero-network/core/blob/master/crates/merod) |
| **meroctl** | CLI for node operations | [`core/crates/meroctl`](https://github.com/calimero-network/core/blob/master/crates/meroctl) |

See [`core/README.md`](https://github.com/calimero-network/core#readme) for complete architecture.

## Component Details

For detailed information on each component, see their README files:

- **SDK**: [`core/crates/sdk/README.md`](https://github.com/calimero-network/core/blob/master/crates/sdk/README.md) - Macros, CRDTs, events
- **Runtime**: [`core/crates/runtime/README.md`](https://github.com/calimero-network/core/blob/master/crates/runtime/README.md) - WASM execution, sandboxing
- **Storage**: [`core/crates/storage/README.md`](https://github.com/calimero-network/core/blob/master/crates/storage/README.md) - CRDT collections, merging
- **DAG**: [`core/crates/dag/README.md`](https://github.com/calimero-network/core/blob/master/crates/dag/README.md) - Causal ordering, dependency resolution
- **Node**: [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md) - NodeManager, sync, events
- **Network**: [`core/crates/network/README.md`](https://github.com/calimero-network/core/blob/master/crates/network/README.md) - libp2p, Gossipsub, P2P
- **Server**: [`core/crates/server/README.md`](https://github.com/calimero-network/core/blob/master/crates/server/README.md) - JSON-RPC, WebSocket, SSE

## Deep Dives

For detailed architecture information:

- **DAG Logic**: [`core/crates/dag/README.md`](https://github.com/calimero-network/core/blob/master/crates/dag/README.md) - Causal ordering algorithms
- **Node Architecture**: [`core/crates/node/readme/architecture.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/architecture.md) - Complete system design
- **Sync Protocol**: [`core/crates/node/readme/sync-protocol.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/sync-protocol.md) - Delta propagation details
- **Storage**: [`core/crates/storage/README.md`](https://github.com/calimero-network/core/blob/master/crates/storage/README.md) - CRDT types and merge semantics
- **Network**: [`core/crates/network/README.md`](https://github.com/calimero-network/core/blob/master/crates/network/README.md) - P2P protocols and configuration

---

**Next**: Learn about specific concepts: [Contexts](contexts.md) | [Identity](identity.md) | [Applications](applications.md) | [Nodes](nodes.md)
