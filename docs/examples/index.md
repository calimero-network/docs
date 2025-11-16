# Examples

Learn Calimero by exploring working examples. All examples include source code, README files, and Merobox workflow configurations.

## Core Apps Examples

**[Core Apps Examples](core-apps-examples.md)** — Reference implementations from `core/apps` demonstrating SDK patterns and CRDT usage.

These examples live in [`calimero-network/core/apps`](https://github.com/calimero-network/core/tree/master/apps):

- **kv-store** - Basic CRDT operations, key-value storage
- **blobs** - File/blob management with content addressing
- **collaborative-editor** - Text collaboration with RGA CRDT
- **private-data** - Private storage patterns
- **team-metrics** - Nested CRDT structures
- **xcall-example** - Cross-context communication

**Quick start:**
```bash
cd core/apps/kv-store
./build.sh
meroctl --node node1 app install --path build/kv_store.wasm
```

## Application Examples

For complete applications, see:

- **Battleships** - Multiplayer game - [`battleships`](https://github.com/calimero-network/battleships) repository
- **Shared Todo** - Collaborative task list - [`shared-todo-backlog`](https://github.com/calimero-network/shared-todo-backlog) repository
- **KV Store** - Template app - Created via `npx create-mero-app`

## By Complexity

Examples organized by difficulty:

- **Starter**: Basic CRDT usage (kv-store, counters)
- **Intermediate**: Event handling, blob management, nested structures
- **Advanced**: Cross-context calls, complex state machines

## Getting Started with Examples

1. Clone or browse the repository
2. Read the README for setup instructions
3. Run `./build.sh` or `pnpm run logic:build`
4. Install on a local node using `meroctl`
5. Explore the code and adapt patterns to your app

See [Getting Started](../getting-started/index.md) for installation and setup.
