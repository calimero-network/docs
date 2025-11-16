# Nodes

A **node** (`merod`) is the core runtime that orchestrates synchronization, event handling, and blob distribution across a distributed network of peers. It wraps the DAG with WASM execution, networking, and lifecycle management.

## What Nodes Do

**Core Responsibilities**:
1. **Delta Management**: Apply deltas to WASM state in correct causal order
2. **Network Coordination**: Gossipsub broadcasts + P2P sync streams
3. **Event Execution**: Trigger event handlers on receiving nodes
4. **Blob Distribution**: Content-addressed file sharing
5. **Resource Management**: Memory limits, cleanup, garbage collection

## Node Types

### Coordinator Node
- First node in a network
- Handles initial context creation and bootstrap
- Can serve as entry point for new peers

```bash
merod --node-type coordinator
```

### Peer Node
- Joins existing network
- Connects to coordinator or other peers
- Participates in P2P mesh

```bash
merod --node-type peer --swarm-addrs /ip4/127.0.0.1/tcp/2428
```

## Node Architecture

```
┌─────────────────────────────────────────────────────────┐
│ NodeManager (Actix Actor)                               │
│  - Orchestrates all components                          │
│  - Periodic timers (cleanup, heartbeat)                 │
└────────────────┬────────────────────────────────────┘
                 │
     ┌───────────┴───────────┬─────────────┐
     │                       │             │
┌────▼────────┐    ┌────────▼──────┐   ┌──▼───────────┐
│NodeClients  │    │NodeManagers   │   │NodeState     │
│ - Context   │    │ - BlobManager │   │ - BlobCache  │
│ - Node      │    │ - SyncManager │   │ - DeltaStores│
└─────────────┘    └───────────────┘   └──────────────┘
```

### NodeManager
Main orchestrator that manages:
- **Periodic timers**:
  - Blob eviction (every 5 min)
  - Delta cleanup (every 60 sec)
  - Hash heartbeat (every 30 sec)
- **Context subscriptions**: Subscribe to all contexts on startup
- **Lifecycle management**: Start/stop, graceful shutdown

### NodeClients
External service clients:
- **ContextClient**: Execute WASM methods, query DAG heads, get root hash
- **NodeClient**: Subscribe/unsubscribe to contexts, broadcast deltas, open P2P streams

### NodeManagers
Service managers:
- **BlobManager**: Store blobs (content-addressed), retrieve by ID, garbage collection
- **SyncManager**: Trigger periodic sync, track last sync time per context, coordinate P2P streams

### NodeState
Runtime state (mutable caches):
- **blob_cache**: LRU cache for frequently accessed blobs
- **delta_stores**: Per-context DAG stores

## Synchronization

Nodes use a **dual-path synchronization strategy**:

### Path 1: Gossipsub Broadcast (Primary)
- **Latency**: ~100-200ms
- **Reliability**: Excellent in good network conditions
- **Purpose**: Fast, real-time propagation

All peers receive deltas via Gossipsub mesh within ~100-200ms.

### Path 2: Periodic P2P Sync (Fallback)
- **Frequency**: Every 10-30 seconds
- **Reliability**: Ensures eventual consistency
- **Purpose**: Catch-up after network issues or downtime

Direct P2P stream exchange of missing deltas ensures no data loss.

For detailed sync flow, see [Architecture Overview](architecture.md#synchronization-flow).

## Event Handling

When a delta is applied:

1. **Author node**: Skips event handler (assumes local UI already updated)
2. **Peer nodes**: Execute event handlers automatically after delta application
3. **Event propagation**: Events are included in delta broadcast to all peers

This ensures:
- Real-time updates across all nodes
- No duplicate event handling on author node
- Consistent event ordering via DAG causal ordering

## Blob Distribution

Nodes manage content-addressed blob storage:

- **Storage**: Blobs stored by content hash (blob ID)
- **Caching**: LRU cache for frequently accessed blobs (evicts after 5 min, or when cache exceeds 100 blobs / 500 MB)
- **Distribution**: Peers request blobs from each other via P2P streams
- **Garbage collection**: Unused blobs evicted periodically

## Admin Surfaces

Nodes expose several interfaces:

### JSON-RPC Server
- **Port**: 2528 (default)
- **Purpose**: Client interaction, method calls, queries
- **Endpoints**: `/jsonrpc` (RPC calls), `/jsonrpc/stream` (subscriptions)

### WebSocket
- **Purpose**: Real-time subscriptions (deltas, events, state changes)
- **Endpoint**: `/ws`
- **Protocol**: JSON-RPC over WebSocket

### Server-Sent Events (SSE)
- **Purpose**: Alternative to WebSocket for event streaming
- **Endpoint**: `/sse`
- **Use case**: Browser-friendly real-time updates

### Admin API
- **Port**: 2528 (default)
- **Endpoint**: `/admin-api/`
- **Purpose**: Node administration, context management, identity operations
- **Authentication**: JWT tokens

## Monitoring & Debugging

Key metrics and logs:

- **DAG stats**: Pending deltas, applied deltas, DAG heads per context
- **Network stats**: Peer count, Gossipsub mesh health, P2P stream activity
- **Performance**: Delta application latency, sync duration, memory usage
- **Events**: Event handler execution, errors, warnings

See [Monitor & Debug](../operator-track/monitor-and-debug.md) for detailed guidance.

## Configuration

Nodes can be configured via:
- **Command-line flags**: `--node-type`, `--swarm-addrs`, `--config`
- **Configuration file**: TOML file with network, storage, runtime settings
- **Environment variables**: Override specific settings

## Deep Dives

For detailed node documentation:

- **Node Architecture**: [`core/crates/node/readme/architecture.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/architecture.md) - Complete system design
- **Sync Configuration**: [`core/crates/node/readme/sync-configuration.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/sync-configuration.md) - Tuning parameters
- **Event Handling**: [`core/crates/node/readme/event-handling.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/event-handling.md) - Event flow and handlers
- **Troubleshooting**: [`core/crates/node/readme/troubleshooting.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/troubleshooting.md) - Common issues

## Related Topics

- [Run a Local Network](../operator-track/run-a-local-network.md) - Getting started with nodes
- [Architecture Overview](architecture.md) - How nodes fit into the system
- [Contexts](contexts.md) - Application instances managed by nodes
