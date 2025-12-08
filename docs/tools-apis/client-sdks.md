# Calimero Client SDKs

Client SDKs for interacting with Calimero nodes programmatically. These SDKs provide programmatic access to Calimero's admin API, enabling you to build sidecar tools, developer utilities, monitoring scripts, and automation workflows.

## Overview

Calimero provides three client SDKs for different language ecosystems:

| SDK | Language | Repository | Authentication Support | Primary Use Cases |
| --- | --- | --- | --- | --- |
| **Rust Client** | Rust | `core/crates/client` | ⚠️ Not yet supported | Sidecar tools, CLI utilities, developer tools |
| **Python Client** | Python | `calimero-client-py` | ⚠️ Not yet supported | Automation scripts, monitoring tools, developer tools |
| **JavaScript Client** | TypeScript/JavaScript | `calimero-client-js` | ✅ Full support | Web apps, browser extensions, Node.js tools |

!!! warning "Authentication Status"
    **Rust and Python clients do not currently support authentication.** Authentication support is planned for future releases. Current usage is intended for:
    - **Sidecar tools** - Local services running alongside Calimero nodes
    - **Developer tools** - Scripts and utilities for development/testing
    - **Internal automation** - CI/CD pipelines and internal tooling
    
    **JavaScript client has full authentication support** including JWT token management, wallet-based authentication, and React components for user authentication flows.

## Use Cases

### Sidecar Tools

Tools that run alongside Calimero nodes to provide additional functionality:

- **Metrics collectors** - Export node metrics to Prometheus, DataDog, etc.
- **Log aggregators** - Process and forward node logs
- **Health checkers** - Monitor node health and alert on issues
- **Backup services** - Periodically backup node state
- **Monitoring dashboards** - Custom dashboards for node status

### Developer Tools

Utilities for development and testing:

- **Test scripts** - Automated testing of Calimero applications
- **Deployment tools** - Scripts for deploying and managing applications
- **Debugging tools** - Utilities for inspecting node state
- **Development helpers** - Scaffolding and code generation tools

### Automation & CI/CD

Automated workflows for DevOps:

- **CI pipelines** - Automated testing and deployment
- **Release automation** - Scripts for packaging and releasing
- **Health monitoring** - Automated health checks and alerts
- **Data migration** - Scripts for migrating data between nodes

## Rust Client SDK

The Rust client SDK (`core/crates/client`) provides a trait-based abstraction for interacting with Calimero nodes. It's designed for building command-line tools, sidecar services, and developer utilities.

### Features

- **Trait-based design** - Flexible authentication and storage backends
- **Async/await support** - Full async support with `tokio`
- **Comprehensive API** - Access to all Calimero admin endpoints
- **Error handling** - Robust error types and handling
- **Type safety** - Strongly typed with Rust's type system

### Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
calimero-client = { path = "../core/crates/client" }
# Or from crates.io (when published)
# calimero-client = "0.1.0"
```

### Quick Start

```rust
use calimero_client::{create_connection, create_client, AuthMode, ConnectionInfo};
use calimero_client::traits::{ClientAuthenticator, ClientStorage};
use url::Url;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    // Create connection
    let api_url = Url::parse("http://localhost:2528")?;
    let authenticator = CliAuthenticator::new();
    let storage = FileStorage::new();
    
    let connection = ConnectionInfo::new(
        api_url,
        Some("node1".to_string()),
        authenticator,
        storage,
    );
    
    // Create client
    let client = Client::new(connection)?;
    
    // List contexts
    let contexts = client.list_contexts().await?;
    println!("Found {} contexts", contexts.data.len());
    
    // List applications
    let apps = client.list_applications().await?;
    println!("Found {} applications", apps.data.len());
    
    Ok(())
}
```

### Authentication

!!! warning "Authentication Not Yet Supported"
    The Rust client currently supports `AuthMode::None` only. Authentication support with JWT tokens is planned for a future release.

```rust
use calimero_client::{AuthMode, ConnectionInfo};

// Currently only AuthMode::None is supported
let connection = ConnectionInfo::new(
    api_url,
    Some("node1".to_string()),
    CliAuthenticator::new(),
    FileStorage::new(),
);
```

### API Examples

#### Context Management

```rust
// List all contexts
let contexts = client.list_contexts().await?;

// Get specific context
let context = client.get_context(&context_id).await?;

// Create new context
let create_request = CreateContextRequest {
    application_id: app_id,
    protocol: "near".to_string(),
    params: Some(json!({"network": "testnet"}).to_string()),
};
let new_context = client.create_context(create_request).await?;

// Delete context
client.delete_context(&context_id).await?;
```

#### Application Management

```rust
// List applications
let apps = client.list_applications().await?;

// Get application
let app = client.get_application(&app_id).await?;

// Install development application
let install_request = InstallDevApplicationRequest {
    path: "/path/to/app.wasm".to_string(),
    metadata: None,
};
client.install_dev_application(install_request).await?;

// Uninstall application
client.uninstall_application(&app_id).await?;
```

#### Function Execution

```rust
use calimero_client::client::Client;

// Execute function via JSON-RPC
let result = client.execute_function(
    &context_id,
    "set_value",
    r#"{"key": "test", "value": "hello"}"#,
    &executor_public_key,
).await?;
```

#### Blob Management

```rust
// Upload blob
let data = b"Hello, Calimero!".to_vec();
let blob_info = client.upload_blob(data, Some(&context_id)).await?;

// List blobs
let blobs = client.list_blobs().await?;

// Get blob info
let info = client.get_blob_info(&blob_id).await?;

// Delete blob
client.delete_blob(&blob_id).await?;
```

### Architecture

The Rust client uses a trait-based design for flexibility:

```rust
pub trait ClientAuthenticator {
    async fn authenticate(&self, url: &Url) -> Result<JwtToken>;
    // ...
}

pub trait ClientStorage {
    async fn load_tokens(&self, node_name: &str) -> Result<Option<JwtToken>>;
    async fn save_tokens(&self, node_name: &str, tokens: &JwtToken) -> Result<()>;
    // ...
}

pub struct Client<A, S> 
where
    A: ClientAuthenticator,
    S: ClientStorage,
{
    connection: ConnectionInfo<A, S>,
}
```

This allows you to implement custom authenticators and storage backends for your specific use case.

### Error Handling

```rust
use calimero_client::errors::ClientError;

match client.list_contexts().await {
    Ok(response) => println!("Success: {:?}", response),
    Err(ClientError::Network { message }) => {
        eprintln!("Network error: {}", message);
    }
    Err(ClientError::Authentication { message }) => {
        eprintln!("Auth error: {}", message);
    }
    Err(e) => eprintln!("Error: {:?}", e),
}
```

### Related Documentation

- **Repository**: [`calimero-network/core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client)
- **Source code**: [`core/crates/client/src`](https://github.com/calimero-network/core/tree/master/crates/client/src)

## Python Client SDK

The Python client SDK (`calimero-client-py`) provides Python bindings built with PyO3 for high-performance integration with Calimero nodes. Perfect for automation scripts, monitoring tools, and developer utilities.

### Features

- **High performance** - Built with Rust and PyO3 for optimal performance
- **Comprehensive API** - Full access to Calimero Network functionality
- **Type safety** - Strongly typed Python bindings
- **Async support** - Built-in async/await support
- **Easy installation** - Simple `pip install`

### Installation

```bash
pip install calimero-client-py
```

### Quick Start

```python
import asyncio
from calimero_client_py import create_connection, create_client, AuthMode

async def main():
    # Create connection
    connection = create_connection(
        base_url="http://localhost:2528",
        auth_mode=AuthMode.NONE  # Authentication not yet supported
    )
    
    # Create client
    client = create_client(connection)
    
    # List contexts
    contexts = await client.list_contexts()
    print(f"Found {len(contexts.data)} contexts")
    
    # List applications
    apps = await client.list_applications()
    print(f"Found {len(apps.data)} applications")

if __name__ == "__main__":
    asyncio.run(main())
```

### Authentication

!!! warning "Authentication Not Yet Supported"
    The Python client currently supports `AuthMode.NONE` only. Authentication support with JWT tokens is planned for a future release.

```python
from calimero_client_py import create_connection, AuthMode

# Currently only AuthMode.NONE is supported
connection = create_connection(
    base_url="http://localhost:2528",
    auth_mode=AuthMode.NONE
)
```

### API Examples

#### Context Management

```python
# List all contexts
contexts = await client.list_contexts()

# Get specific context
context = await client.get_context(context_id)

# Create new context
context = await client.create_context(
    application_id=app_id,
    protocol="near",
    params='{"network": "testnet"}'
)

# Delete context
await client.delete_context(context_id)
```

#### Application Management

```python
# List applications
apps = await client.list_applications()

# Get application
app = await client.get_application(app_id)

# Install development application
response = await client.install_dev_application(
    path="/path/to/app.wasm",
    metadata=None
)

# Uninstall application
await client.uninstall_application(app_id)
```

#### Function Execution

```python
# Execute function via JSON-RPC
result = await client.execute_function(
    context_id=context_id,
    method="set_value",
    args='{"key": "test", "value": "hello"}',
    executor_public_key=executor_public_key
)
```

#### Blob Management

```python
# Upload blob
with open("file.dat", "rb") as f:
    data = f.read()
blob_info = await client.upload_blob(data, context_id=context_id)

# List blobs
blobs = await client.list_blobs()

# Get blob info
info = await client.get_blob_info(blob_id)

# Delete blob
await client.delete_blob(blob_id)
```

### Error Handling

```python
from calimero_client_py import ClientError

try:
    contexts = await client.list_contexts()
except ClientError as e:
    if e.error_type == "Network":
        print(f"Network error: {e.message}")
    elif e.error_type == "Authentication":
        print(f"Auth error: {e.message}")
    else:
        print(f"Error: {e.message}")
```

### Development

#### Building from Source

```bash
# Install maturin
pip install maturin

# Build the package
maturin build --release

# Install in development mode
maturin develop
```

#### Running Tests

```bash
# Test Python integration
python -m pytest tests/

# Test the environment
python example_usage.py
```

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-py`](https://github.com/calimero-network/calimero-client-py)
- **PyPI Package**: [`calimero-client-py`](https://pypi.org/project/calimero-client-py/)
- **README**: [`calimero-client-py/README.md`](https://github.com/calimero-network/calimero-client-py/blob/master/README.md)

## JavaScript Client SDK

The JavaScript client SDK (`calimero-client-js`) provides TypeScript/JavaScript bindings with full authentication support. Ideal for web applications, browser extensions, and Node.js tools.

### Features

- **Full authentication** - JWT token management, wallet-based auth, React components
- **Real-time updates** - WebSocket and SSE subscriptions
- **TypeScript support** - Full type definitions
- **React components** - Pre-built UI components for authentication
- **Browser & Node.js** - Works in both environments

### Installation

```bash
# npm
npm install @calimero-network/calimero-client

# yarn
yarn add @calimero-network/calimero-client

# pnpm
pnpm add @calimero-network/calimero-client
```

### Quick Start

#### Basic Setup

```typescript
import {
  setAppEndpointKey,
  setApplicationId,
  JsonRpcClient,
} from '@calimero-network/calimero-client';

// Configure node URL and application ID
setAppEndpointKey('https://your-calimero-node-url.com');
setApplicationId('your-application-id');

// Create RPC client
const rpcClient = new JsonRpcClient(
  'https://your-calimero-node-url.com',
  '/jsonrpc'
);

// Make a query
const response = await rpcClient.query({
  contextId: 'context-id',
  method: 'get_value',
  argsJson: { key: 'test' },
  executorPublicKey: 'public-key',
});
```

#### Authentication Flow

```typescript
import { ClientLogin, AccessTokenWrapper } from '@calimero-network/calimero-client';

// Use ClientLogin component for authentication
function LoginPage() {
  const handleLoginSuccess = () => {
    // Navigate to authenticated section
    window.location.href = '/dashboard';
  };

  return <ClientLogin sucessRedirect={handleLoginSuccess} />;
}

// Wrap your app with AccessTokenWrapper for automatic token management
function App() {
  return (
    <AccessTokenWrapper getNodeUrl={() => localStorage.getItem('node_url') || ''}>
      <YourApp />
    </AccessTokenWrapper>
  );
}
```

### Authentication

The JavaScript client has **full authentication support** including:

- **JWT token management** - Automatic token storage and refresh
- **Wallet-based authentication** - Support for NEAR wallet
- **React components** - Pre-built UI components (`ClientLogin`, `SetupModal`)
- **Manual token handling** - Direct token management APIs

#### Complete Authentication Flow

```typescript
import {
  SetupModal,
  ClientLogin,
  AccessTokenWrapper,
} from '@calimero-network/calimero-client';

// Step 1: Setup (configure node URL and application ID)
function SetupPage() {
  const handleSetupComplete = () => {
    navigate('/auth');
  };

  return <SetupModal successRoute={handleSetupComplete} />;
}

// Step 2: Authentication (user login)
function AuthPage() {
  const handleLoginSuccess = () => {
    navigate('/home');
  };

  return <ClientLogin sucessRedirect={handleLoginSuccess} />;
}

// Step 3: App with automatic token management
function App() {
  return (
    <AccessTokenWrapper getNodeUrl={() => localStorage.getItem('node_url') || ''}>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </AccessTokenWrapper>
  );
}
```

#### Manual Token Usage

```typescript
import {
  setAccessToken,
  getJWTObject,
  JsonRpcClient,
} from '@calimero-network/calimero-client';

// Set your token
setAccessToken('your-jwt-token-here');

// Get contextId and executorPublicKey from the token
const jwt = getJWTObject();
const contextId = jwt?.context_id;
const executorPublicKey = jwt?.executor_public_key;

// Use the client
const rpcClient = new JsonRpcClient('your-api-url', '/jsonrpc');
const response = await rpcClient.query({
  contextId,
  method: 'your-method',
  argsJson: { /* your args */ },
  executorPublicKey,
});
```

### API Examples

#### RPC Client

```typescript
import { JsonRpcClient } from '@calimero-network/calimero-client';

const rpcClient = new JsonRpcClient(
  process.env.NEXT_PUBLIC_API_URL,
  '/jsonrpc'
);

// Make a query (read-only)
const queryResponse = await rpcClient.query({
  contextId: 'context-id',
  method: 'get_posts',
  argsJson: { limit: 10 },
  executorPublicKey: 'public-key',
});

// Make a mutation (write operation)
const mutateResponse = await rpcClient.mutate({
  contextId: 'context-id',
  method: 'create_post',
  argsJson: {
    title: 'My First Post',
    text: 'This is my first post',
  },
  executorPublicKey: 'public-key',
});
```

#### WebSocket Subscriptions

```typescript
import { WsSubscriptionsClient } from '@calimero-network/calimero-client';

const subscriptionsClient = new WsSubscriptionsClient(
  process.env.NEXT_PUBLIC_API_URL,
  '/ws'
);

// Connect and subscribe
await subscriptionsClient.connect();
subscriptionsClient.subscribe(['context-id']);

// Handle incoming events
subscriptionsClient.addCallback((event) => {
  console.log('Received event:', event);
});

// Clean up
subscriptionsClient.disconnect();
```

#### SSE Subscriptions

```typescript
import { SseSubscriptionsClient } from '@calimero-network/calimero-client';

const sseClient = new SseSubscriptionsClient(
  process.env.NEXT_PUBLIC_API_URL,
  '/sse'
);

// Connect to SSE endpoint
await sseClient.connect();
await sseClient.subscribe(['context-id']);

// Handle incoming events
sseClient.addCallback((event) => {
  console.log('Received SSE event:', event);
});

// Clean up
sseClient.disconnect();
```

#### Admin API

```typescript
import { apiClient } from '@calimero-network/calimero-client';

// List contexts
const contexts = await apiClient.node().getContexts();

// Create context
const newContext = await apiClient.node().createContext(
  applicationId,
  'near' // protocol
);

// List applications
const apps = await apiClient.node().getApplications();

// Get application
const app = await apiClient.node().getApplication(appId);
```

### Error Handling

```typescript
try {
  const response = await rpcClient.query(params);
  if (response.error) {
    // Handle RPC error
    console.error('RPC Error:', response.error.message);
  } else {
    // Process successful response
    console.log('Result:', response.result);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Request failed:', error);
}
```

### Best Practices

1. **Token Management**
   - Use `AccessTokenWrapper` for automatic token refresh
   - Store sensitive information in environment variables
   - Never expose tokens in client-side code

2. **Connection Management**
   - Always clean up WebSocket connections when done
   - Use unique connection IDs for multiple connections
   - Implement reconnection logic for production

3. **Error Handling**
   - Always check for errors in RPC responses
   - Implement proper error boundaries in React
   - Log errors appropriately for debugging

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-js`](https://github.com/calimero-network/calimero-client-js)
- **NPM Package**: [`@calimero-network/calimero-client`](https://www.npmjs.com/package/@calimero-network/calimero-client)
- **README**: [`calimero-client-js/README.md`](https://github.com/calimero-network/calimero-client-js/blob/master/README.md)

## Comparison

| Feature | Rust Client | Python Client | JavaScript Client |
| --- | --- | --- | --- |
| **Language** | Rust | Python | TypeScript/JavaScript |
| **Performance** | High (native) | High (Rust bindings) | Good (JavaScript) |
| **Authentication** | ⚠️ Not yet | ⚠️ Not yet | ✅ Full support |
| **Async Support** | ✅ Tokio | ✅ asyncio | ✅ Native |
| **Type Safety** | ✅ Rust types | ✅ Python types | ✅ TypeScript |
| **React Components** | ❌ | ❌ | ✅ |
| **WebSocket** | ✅ | ✅ | ✅ |
| **SSE** | ✅ | ✅ | ✅ |
| **Best For** | CLI tools, sidecars | Scripts, automation | Web apps, browsers |

## Choosing the Right SDK

**Choose Rust Client if:**
- Building command-line tools or sidecar services
- Need maximum performance
- Already using Rust in your stack
- Building developer utilities

**Choose Python Client if:**
- Building automation scripts or monitoring tools
- Working with Python-based tooling
- Need quick prototyping
- Building CI/CD pipelines

**Choose JavaScript Client if:**
- Building web applications or browser extensions
- Need authentication flows
- Want React components
- Building user-facing applications

## Related Topics

- [meroctl CLI](meroctl-cli.md) - Command-line interface for Calimero
- [Introduction](../intro/index.md) - Understanding Calimero's core concepts
- [Contexts](../core-concepts/contexts.md) - Working with contexts
- [Identity](../core-concepts/identity.md) - Authentication and identity management

