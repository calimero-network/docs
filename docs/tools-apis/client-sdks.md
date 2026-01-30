# Calimero Client SDKs

Client SDKs that let you interact with Calimero nodes from code using Python, Rust, or frontend stacks like Next.js, React, TypeScript, and Vite. Use them to build developer tools, monitoring, and automation around Calimero.

## Overview

Calimero provides three client SDKs for different language ecosystems:

| SDK | Language | Repository | Authentication Support | Primary Use Cases |
| --- | --- | --- | --- | --- |
| **Rust Client** | Rust | [`core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client){:target="_blank"} | Full support | Sidecar tools, CLI utilities, developer tools |
| **Python Client** | Python | [`calimero-client-py`](https://github.com/calimero-network/calimero-client-py){:target="_blank"} | Full support | Automation scripts, monitoring tools, developer tools |
| **JavaScript Client** | TypeScript/JavaScript | [`calimero-client-js`](https://github.com/calimero-network/calimero-client-js){:target="_blank"} | Full support | Web apps, browser extensions, Node.js tools |

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
# Or from crates.io using "cargo add calimero-client"
# calimero-client = "0.9.0"
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

```rust
use calimero_client::{AuthMode, ConnectionInfo};

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

- **Repository**: [`calimero-network/core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client){:target="_blank"}
- **Source code**: [`core/crates/client/src`](https://github.com/calimero-network/core/tree/master/crates/client/src){:target="_blank"}

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
$: pip install calimero-client-py
> ...
> Successfully installed calimero-client-py-0.3.0
```

### Quick Start

```python
import asyncio
from calimero_client_py import create_connection, create_client, AuthMode

async def main():
    # Create connection
    connection = create_connection(
        api_url="http://localhost:2528",
        node_name="node1",
    )

    client = create_client(connection)
    
    contexts = client.list_contexts()
    print(f"✓ Found contexts: {contexts}")

    applications = client.list_applications()
    print(f"✓ Found applications: {applications}")


if __name__ == "__main__":
    asyncio.run(main())
```

### Authentication
For local development with merod the auth is disabled so you can write any value for JWT access and refresh tokens.

```bash
$: python main.py
> Starting authentication...
> Please authenticate at: http://localhost:2528/
> Enter access token: <ANY_VALUE>
> Enter refresh token (optional): <ANY_VALUE>
>
> ✓ Found contexts: {'data': {'contexts': [{'applicationId': ....
> ...
> ✓ Found applications: {'data': {'apps': [{'blob': {'bytecode': 'Ca2zM5hue4Te2EYQnKmigkN7WcQHzBCuLFVSJ7zQte58', ' ...
> ...
```

### API Examples

#### Context Management

```python
# List all contexts
contexts = client.list_contexts()

# Get specific context
context = client.get_context(context_id)

# Create new context
context = client.create_context(
    application_id="<APP_ID>",
    protocol="near",
    params='{"network": "testnet"}'
)

# Delete context
client.delete_context(context_id)
```

#### Application Management

```python
# List applications
apps = client.list_applications()

# Get application
app = client.get_application(app_id)

# Install development application
response = client.install_dev_application(
    path="absolute/path/to/app.wasm",
    metadata=None
)

# Uninstall application
client.uninstall_application(app_id)
```

#### Function Execution

```python
# Execute function via JSON-RPC
result = client.execute_function(
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
blob_info = client.upload_blob(data, context_id=context_id)

# List blobs
blobs = client.list_blobs()

# Get blob info
info = client.get_blob_info(blob_id)

# Delete blob
client.delete_blob(blob_id)
```

### Error Handling

```python
from calimero_client_py import ClientError

try:
    contexts = client.list_contexts()
except ClientError as e:
    if e.error_type == "Network":
        print(f"Network error: {e.message}")
    elif e.error_type == "Authentication":
        print(f"Auth error: {e.message}")
    else:
        print(f"Error: {e.message}")
```

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-py`](https://github.com/calimero-network/calimero-client-py){:target="_blank"}
- **PyPI Package**: [`calimero-client-py`](https://pypi.org/project/calimero-client-py/){:target="_blank"}
- **README**: [`calimero-client-py/README.md`](https://github.com/calimero-network/calimero-client-py/blob/master/README.md){:target="_blank"}

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

The `rpcClient` allows you to make RPC calls to your node:

```typescript
// KV Store example
import {
  setAppEndpointKey,
  setApplicationId,
  rpcClient,
} from "@calimero-network/calimero-client";

// Configure node URL and application ID
setAppEndpointKey('http://localhost:2528');
setApplicationId('APP_ID');

const contextId = 'CONTEXT_ID';
const executorPublicKey = 'PUBLIC_KEY';

// Args = { key: string, value: string }
// Output = { result: string }
const setResponse = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'set',
    argsJson: { key: 'test', value: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);

const getResponse = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'get',
    argsJson: { key: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);
```

#### Authentication Flow

```typescript
import {
  AppMode,
  CalimeroProvider
  CalimeroConnectButton,
  useCalimero,
} from "@calimero-network/calimero-client";

const APPLICATION_ID = "<APPLICATION_ID>";
const APPLICATION_PAHT = "<APPLICATION_PATH>";

// Wrap application logic in CalimeroProvider
// CalimeroConnectButton -> handles connection to node; JWT generation and callback
// Logout -> handles state cleanup and kills the connection to the node
function App() {
  const { logout } = useCalimero();
  return (
    <CalimeroProvider
      clientApplicationId={APPLICATION_ID}
      mode={AppMode.MultiContext}
      applicationPath={APPLICATION_PATH}
    >
      <YourApp />
      <CalimeroConnectButton />
      <button onClick={() => logout()}>Logout</button>
    </CalimeroProvider>
  );
}
```

### Authentication

The JavaScript client has **full authentication support** including:

- **JWT token management** - Automatic token storage and refresh
- **Wallet-based authentication** - Support for NEAR wallet
- **React components** - Pre-built UI components (`CalimeroConnectButton`, `SetupModal`)
- **Manual token handling** - Direct token management APIs

#### Complete Authentication Flow

```typescript
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  AppMode,
  CalimeroProvider
  CalimeroConnectButton,
  useCalimero,
} from "@calimero-network/calimero-client";

function AuthPage() {
  return <CalimeroConnectButton />;
}

function HomePage() {
  const { logout } = useCalimero();
  return (
    <Wrapper>
      <App>
      <button onClick={() => logout()}>Logout</button>
    </Wrapper>
  )
}

function App() {
  const { isAuthenticated } = useCalimero();
  const navigate = useNavigate();

   useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  }, [isAuthenticated]);

  return (
    <CalimeroProvider
      clientApplicationId={APPLICATION_ID}
      mode={AppMode.MultiContext}
      applicationPath={APPLICATION_PATH}
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </CalimeroProvider>
  );
}
```

#### Manual Token Usage

```typescript
import {
  setAccessToken,
  getJWTObject,
  rpcClient
} from '@calimero-network/calimero-client';

// Set your token
setAccessToken('your-jwt-token-here');

// Get contextId and executorPublicKey from the token
const jwt = getJWTObject();
const contextId = jwt?.context_id;
const executorPublicKey = jwt?.executor_public_key;

// Use the client
const response = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'get',
    argsJson: { key: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);
```

### API Examples

The `WsSubscriptionsClient` enables real-time updates through WebSocket connections:

#### WebSocket Subscriptions

```typescript
import { useCalimero, getContextId } from "@calimero-network/calimero-client";
import { WsSubscriptionsClient } from '@calimero-network/calimero-client';


const { app } = useCalimero();

const eventCallback = useCallback(async (event: WebSocketEvent) => {
    eventListenersRef.current.forEach((event: WebSocketEvent) => {
      // handle event
      console.log(event);
    });
  }, []);

const subscriptionsClient = new WsSubscriptionsClient(
  process.env.NEXT_PUBLIC_API_URL,
  '/ws'
);
// Subscripe to context events
app.subscribeToEvents([getContextId()], eventCallback);
// Unsubscribe from context events
app.unsubscribeFromEvents([getContextId()]);
```

#### SSE Subscriptions

The `SseSubscriptionsClient` provides an HTTP-based alternative for real-time updates using Server-Sent Events:

```typescript
import { SseSubscriptionsClient } from '@calimero-network/calimero-client';

const sseClient = new SseSubscriptionsClient(
  // e.g. http://localhost:2528
  "<NODE-URL>",
  '/sse'
);

// Connect to SSE endpoint
await sseClient.connect();
// Subscribe to specific contexts
await sseClient.subscribe(["<APPLICATION_ID>"]);

// Handle incoming events
sseClient.addCallback((event) => {
  console.log('Received SSE event:', event);
});

// Unsubscribe from contexts
await sseClient.unsubscribe(["<APPLICATION_ID>"]);

// Clean up
sseClient.disconnect();
```

#### Admin API

The `Admin API` allows you to call node functionalities. These can be: fetch context, fetch applications, fetch identities, create context, install application, others...

```typescript
// apiClient automatically checks login authentication status so it needs to be paired with 
// CalimeroProvider and CalimeroConnectButton from previous steps
import {
  apiClient,
} from "@calimero-network/calimero-client";
// fetch all contexts on the node
const contexts = await apiClient.node().getContexts();
// fetch all installed applications
const applications = await apiClient.node().getInstalledApplications();
// install applicaion on the node from a hosted URL
const installationResponse = await apiClient.node().installApplication("<APPLICATION_URL_PATH>");
// fetch all root keys on the node
const rootKeys = await apiClient.admin().getRootKeys();
// fetch all client keys on  the node
const rootKeys = await apiClient.admin().getClientKeys();
// revoke client key
const rootKeys = await apiClient.admin().revokeClientKey("<ROOT_KEY_ID>","<CLIENT_ID>");
...
```

### Error Handling

```typescript
try {
  const response = await rpcClient().execute<Args, Output>(...);
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

**Token Management**

   - Use `CalimeroProvider and CalimeroConnectButton` for login and automatic token refresh
   - Store sensitive information in environment variables
   - Never expose tokens in client-side code

**Connection Management**

   - Always clean up WebSocket connections when done
   - Use unique connection IDs for multiple connections
   - Implement reconnection logic for production

**Error Handling**

   - Always check for errors in RPC responses
   - Implement proper error boundaries in React
   - Log errors appropriately for debugging

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-js`](https://github.com/calimero-network/calimero-client-js){:target="_blank"}
- **NPM Package**: [`@calimero-network/calimero-client`](https://www.npmjs.com/package/@calimero-network/calimero-client){:target="_blank"}
- **README**: [`calimero-client-js/README.md`](https://github.com/calimero-network/calimero-client-js/blob/master/README.md){:target="_blank"}

## Comparison

| Feature | Rust Client | Python Client | JavaScript Client |
| --- | --- | --- | --- |
| **Language** | Rust | Python | TypeScript/JavaScript |
| **Performance** | High (native) | High (Rust bindings) | Good (JavaScript) |
| **Authentication** | ✅ Full support | ✅ Full support | ✅ Full support |
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

