# API Reference

Complete API documentation for Calimero nodes and clients.

## Server API

Calimero nodes expose a JSON-RPC API over HTTP with WebSocket support for real-time subscriptions.

**Base URL**: `http://localhost:2528` (default)

### Endpoints

- **JSON-RPC**: `/jsonrpc` - Standard JSON-RPC 2.0 calls
- **WebSocket**: `/ws` - Real-time subscriptions
- **SSE**: `/sse` - Server-Sent Events for subscriptions
- **Admin API**: `/admin-api/` - Node management endpoints

### API Methods

Common methods:
- `context.create` - Create a new context
- `context.list` - List all contexts
- `context.call` - Call a method on a context
- `app.install` - Install an application
- `identity.create` - Create an identity

### Authentication

Most endpoints require JWT authentication. See [Identity](../core-concepts/identity.md) for authentication flows.

## Complete Documentation

For complete API documentation, including all methods, request/response formats, and error codes:

**→ [`core/crates/server/README.md`](https://github.com/calimero-network/core/blob/master/crates/server/README.md){:target="_blank"}**

## Client SDKs

For easier client development, use the official SDKs:

- **JavaScript/TypeScript**: [`@calimero/client`](https://github.com/calimero-network/calimero-client-js){:target="_blank"} - See [Client SDKs](../tools-apis/client-sdks.md)
- **Python**: [`calimero-client-py`](https://github.com/calimero-network/calimero-client-py){:target="_blank"} - See [Client SDKs](../tools-apis/client-sdks.md)
- **Rust**: [`core/crates/client`](https://github.com/calimero-network/core/blob/master/crates/client/README.md){:target="_blank"}

## CLI Reference

For command-line operations, see [`meroctl` CLI](../tools-apis/meroctl-cli.md).

## Related Topics

- [Tools & APIs](../tools-apis/index.md) - SDKs and developer tools
- [Core Concepts](../core-concepts/index.md) - Architecture and concepts
- [Running Nodes](../operator-track/run-a-local-network.md) - Node setup
