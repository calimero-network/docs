# Core Apps Examples

The `core/apps` directory contains reference implementations demonstrating various SDK patterns and use cases. These examples serve as learning resources and starting points for your own applications.

## Overview

| Example | What it demonstrates | Key SDK features |
| --- | --- | --- |
| **kv-store** | Basic CRDT usage | `UnorderedMap`, `LwwRegister`, events |
| **kv-store-init** | Initialization patterns | `#[app::init]`, state setup |
| **kv-store-with-handlers** | Event handling | Event emission and handlers |
| **blobs** | File/blob management | Blob storage and distribution |
| **collaborative-editor** | Text collaboration | `ReplicatedGrowableArray` (RGA) CRDT |
| **private-data** | Private storage | Node-local secrets and data |
| **team-metrics** | Nested CRDTs | Nested maps, counters, metrics |
| **xcall-example** | Cross-context calls | Inter-context communication |

## kv-store

**Location**: [`core/apps/kv-store`](https://github.com/calimero-network/core/tree/master/apps/kv-store)

**What it does:**
Simple key-value store demonstrating basic CRDT operations and event emission.

**Key features:**
- `UnorderedMap<String, LwwRegister<String>>` for key-value storage
- Event emission for insertions, updates, and removals
- View methods for read-only queries
- Error handling patterns

**API methods:**
- `set(key: String, value: String)` - Store or update a value
- `get(key: &str) -> Option<String>` - Retrieve a value
- `remove(key: &str) -> Option<String>` - Remove a value
- `clear()` - Remove all entries
- `len() -> usize` - Get number of entries
- `entries() -> BTreeMap<String, String>` - Get all entries

**Example usage:**
```bash
# Build
cd core/apps/kv-store
./build.sh

# Install
meroctl --node node1 app install \
  --path res/kv_store.wasm \
  --application-id kv-store

# Create context
meroctl --node node1 context create \
  --application-id kv-store \
  --context-id kv-context

# Set a value
meroctl --node node1 call \
  --context-id kv-context \
  --method set \
  --args '{"key": "hello", "value": "world"}'

# Get a value
meroctl --node node1 call \
  --context-id kv-context \
  --method get \
  --args '{"key": "hello"}'
```

**Learn from this example:**
- Basic CRDT state definition
- Mutations vs views
- Event emission patterns
- Error handling with `app::Result<T>`

## kv-store-with-handlers

**Location**: [`core/apps/kv-store-with-handlers`](https://github.com/calimero-network/core/tree/master/apps/kv-store-with-handlers)

**What it does:**
KV store with event handlers demonstrating real-time event processing.

**Key features:**
- Same KV operations as basic kv-store
- Event handlers that execute on peer nodes
- Event-driven UI updates
- Handler patterns and best practices

**Learn from this example:**
- Event handler implementation
- Real-time event propagation
- UI update patterns

## blobs

**Location**: [`core/apps/blobs`](https://github.com/calimero-network/core/tree/master/apps/blobs)

**What it does:**
Demonstrates blob storage and distribution across the network.

**Key features:**
- Upload files to blob storage
- Content-addressed blob IDs
- Blob listing and retrieval
- Context-aware blob announcements
- Network distribution via P2P

**API methods:**
- `upload_blob(blob_id: [u8; 32], size: u64)` - Register a blob
- `list_blobs() -> Vec<[u8; 32]>` - List all blobs
- `get_blob_info(blob_id: [u8; 32]) -> Option<BlobInfo>` - Get blob metadata

**Example usage:**
```bash
# Upload a blob
meroctl --node node1 blob upload \
  --file ./document.pdf \
  --context-id blob-context

# Register in application
meroctl --node node1 call \
  --context-id blob-context \
  --method upload_blob \
  --args '{"blob_id": "...", "size": 1024}'

# List blobs
meroctl --node node1 call \
  --context-id blob-context \
  --method list_blobs
```

**Learn from this example:**
- Blob storage patterns
- Content-addressed file sharing
- Large file distribution
- P2P blob discovery

## collaborative-editor

**Location**: [`core/apps/collaborative-editor`](https://github.com/calimero-network/core/tree/master/apps/collaborative-editor)

**What it does:**
Real-time collaborative text editor using RGA (Replicated Growable Array) CRDT.

**Key features:**
- Character-level collaborative editing
- `ReplicatedGrowableArray` for conflict-free text operations
- Insert and delete operations at any position
- Edit counting with `Counter` CRDT
- Document metadata (title, statistics)

**API methods:**
- `init() -> EditorState` - Initialize new document
- `set_title(title: String)` - Set document title
- `insert_text(position: usize, text: String)` - Insert text
- `delete_text(start: usize, end: usize)` - Delete text range
- `get_text() -> String` - Get full document text
- `get_title() -> String` - Get document title
- `get_edit_count() -> i64` - Get total edit count

**Example usage:**
```bash
# Insert text at position 0
meroctl --node node1 call \
  --context-id editor-context \
  --method insert_text \
  --args '{"position": 0, "text": "Hello"}'

# Delete text from position 5 to 10
meroctl --node node1 call \
  --context-id editor-context \
  --method delete_text \
  --args '{"start": 5, "end": 10}'

# Get full text
meroctl --node node1 call \
  --context-id editor-context \
  --method get_text
```

**Learn from this example:**
- RGA CRDT for text editing
- Character-level conflict resolution
- Collaborative editing patterns
- Position-based operations

## private-data

**Location**: [`core/apps/private-data`](https://github.com/calimero-network/core/tree/master/apps/private-data)

**What it does:**
Demonstrates private storage for node-local secrets and data.

**Key features:**
- Private storage usage patterns
- Node-local data that never syncs
- Secrets management
- Per-node counters and caches

**API methods:**
- Methods for storing/retrieving private data
- Per-node secret rotation
- Private cache management

**Example usage:**
See workflow in [`workflows/example.yml`](https://github.com/calimero-network/core/blob/master/apps/private-data/workflows/example.yml)

**Learn from this example:**
- Private storage API usage
- Secrets management patterns
- When to use private vs shared storage

## team-metrics

**Location**: [`core/apps/team-metrics-macro`](https://github.com/calimero-network/core/tree/master/apps/team-metrics-macro) and [`core/apps/team-metrics-custom`](https://github.com/calimero-network/core/tree/master/apps/team-metrics-custom)

**What it does:**
Demonstrates nested CRDT structures for team metrics tracking.

**Key features:**
- Nested `UnorderedMap` structures
- Map of team → Map of member → Counter
- Metrics aggregation patterns
- Complex CRDT hierarchies

**API methods:**
- `increment_metric(team: String, member: String)` - Increment member metric
- `get_team_metrics(team: String) -> HashMap<String, i64>` - Get all team metrics
- `get_member_metric(team: String, member: String) -> i64` - Get specific metric

**Learn from this example:**
- Nested CRDT patterns
- Multi-level data structures
- Metrics aggregation
- Complex state management

## xcall-example

**Location**: [`core/apps/xcall-example`](https://github.com/calimero-network/core/tree/master/apps/xcall-example)

**What it does:**
Demonstrates cross-context calls (xcall) for inter-context communication.

**Key features:**
- Cross-context method calls
- Context-to-context communication
- Ping-pong pattern demonstration
- Event emission from xcalls

**API methods:**
- `ping(target_context: String)` - Send ping to another context
- `pong()` - Handle ping (increments counter)
- `get_counter() -> u64` - Get ping counter
- `reset_counter()` - Reset counter

**Example usage:**
```bash
# Deploy to Context A and Context B

# Send ping from Context A to Context B
meroctl --node node1 call \
  --context-id context-a \
  --method ping \
  --args '{"target_context": "<context-b-id>"}'

# Check counter on Context B
meroctl --node node1 call \
  --context-id context-b \
  --method get_counter
```

**Learn from this example:**
- Cross-context communication
- xcall patterns
- Inter-context coordination
- Multi-context applications

## Running Examples

### Using Merobox Workflows

Most examples include Merobox workflow files for automated testing:

```bash
# Run example workflow
cd core/apps/kv-store
merobox bootstrap run workflows/kv-store.yml

# Or for other examples
cd core/apps/collaborative-editor
merobox bootstrap run workflows/collaborative-editor.yml
```

### Manual Testing

```bash
# 1. Build the example
cd core/apps/kv-store
./build.sh

# 2. Start nodes (via merobox)
merobox run --count 2

# 3. Install application
meroctl --node calimero-node-1 app install \
  --path res/kv_store.wasm \
  --application-id kv-store

# 4. Create context
meroctl --node calimero-node-1 context create \
  --application-id kv-store \
  --context-id test-context

# 5. Test methods
meroctl --node calimero-node-1 call \
  --context-id test-context \
  --method set \
  --args '{"key": "hello", "value": "world"}'
```

## Learning Path

**Start here:**
1. **kv-store** - Understand basic CRDT operations
2. **kv-store-with-handlers** - Learn event handling
3. **collaborative-editor** - See advanced CRDT usage (RGA)

**Then explore:**
- **blobs** - File sharing patterns
- **private-data** - Secrets management
- **team-metrics** - Complex nested structures
- **xcall-example** - Cross-context communication

## Related Topics

- [SDK Guide](../builder-directory/sdk-guide.md) - Complete SDK reference
- [Build Your First Application](../getting-started/build-your-first-application.md) - Step-by-step tutorial
- [Applications](../core-concepts/applications.md) - Application architecture

## Deep Dives

For detailed example documentation:

- **kv-store**: [`core/apps/kv-store/README.md`](https://github.com/calimero-network/core/blob/master/apps/kv-store/README.md)
- **collaborative-editor**: [`core/apps/collaborative-editor/README.md`](https://github.com/calimero-network/core/blob/master/apps/collaborative-editor/README.md)
- **blobs**: [`core/apps/blobs/README.md`](https://github.com/calimero-network/core/blob/master/apps/blobs/README.md)
- **xcall-example**: [`core/apps/xcall-example/README.md`](https://github.com/calimero-network/core/blob/master/apps/xcall-example/README.md)

