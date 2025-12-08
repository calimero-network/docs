# Calimero Developer Tools

Developer tools for building, testing, and scaffolding Calimero applications locally. These tools streamline the development workflow from initial project setup to testing and deployment.

## Overview

| Tool | Purpose | Language | Installation |
| --- | --- | --- | --- |
| **Merobox** | Local multi-node networks, workflow orchestration, testing | Python | `pipx install merobox` or `brew install merobox` |
| **ABI Codegen** | Generate TypeScript clients from Rust application ABIs | TypeScript/Node.js | `npm install @calimero-network/abi-codegen` |
| **create-mero-app** | Scaffold new Calimero apps from kv-store boilerplate | TypeScript/Node.js | `npx create-mero-app@latest` |

## Merobox

Merobox is a Python CLI tool for managing Calimero nodes in Docker containers. It's essential for local development and testing, enabling you to spin up multi-node networks, execute complex workflows, and automate testing scenarios.

### Features

- **Node Management** - Start, stop, and monitor Calimero nodes in Docker
- **Multi-Node Networks** - Run multiple nodes locally for testing P2P synchronization
- **Workflow Orchestration** - Execute complex multi-step workflows with YAML files
- **Auth Service Integration** - Traefik proxy and authentication service with nip.io DNS
- **Context Management** - Create and manage blockchain contexts
- **Identity Management** - Generate and manage cryptographic identities
- **Function Calls** - Execute smart contract functions via JSON-RPC
- **Testing Support** - Python testing fixtures for integration tests

### Installation

**Option 1: Using pipx (recommended)**

```bash
pipx install merobox
```

**Option 2: Using Homebrew**

```bash
brew install merobox
```

**Option 3: From source**

```bash
git clone https://github.com/calimero-network/merobox.git
cd merobox
pipx install -e .
```

### Quick Start

#### Basic Node Management

```bash
# Start a single Calimero node
merobox run --name my-node

# Start multiple nodes
merobox run --count 2

# Start with custom ports
merobox run --name my-node --server-port 2428 --swarm-port 2528

# List running nodes
merobox list

# Check node health
merobox health my-node

# View node logs
merobox logs my-node --follow

# Stop a node
merobox stop my-node

# Remove all node data (destructive!)
merobox nuke my-node
```

#### Application Management

```bash
# Install a WASM application on a node
merobox install my-node /path/to/app.wasm

# Call a function on an installed application
merobox call my-node <app-id> <method> '{"arg": "value"}'
```

#### Identity & Context Management

```bash
# Create a new identity
merobox identity create

# Create a new context
merobox context create my-node <context-config>

# Join a node to a context
merobox join my-node <context-id> <private-key>
```

### Workflow Orchestration

Merobox supports complex multi-step workflows defined in YAML files:

```yaml
# workflow.yml
image: "ghcr.io/calimero-network/merod:edge"

nodes:
  count: 2
  prefix: "calimero-node"

steps:
  - name: "Create identities"
    type: identity
    identity: "alice"
    
  - name: "Create context"
    type: context
    application_id: "my-app"
    protocol: "near"
    params: '{"network": "testnet"}'
    
  - name: "Install application"
    type: install
    node: "calimero-node-1"
    path: "./app.wasm"
    
  - name: "Execute function"
    type: execute
    node: "calimero-node-1"
    context_id: "{{ steps.create_context.context_id }}"
    method: "set_value"
    args: '{"key": "test", "value": "hello"}'
    executor_public_key: "{{ steps.create_identities.alice.public_key }}"
```

**Execute a workflow:**

```bash
merobox bootstrap run workflow.yml
```

**Workflow steps:**
- `identity` - Create cryptographic identities
- `context` - Create blockchain contexts
- `install` - Install WASM applications
- `execute` - Execute function calls
- `join` - Join contexts
- `invite_open` - Create open invitations
- `join_open` - Join via open invitation
- `wait` - Wait for conditions
- `assert` - Assert expected results
- `repeat` - Repeat steps multiple times
- `script` - Execute shell scripts

### Auth Service Integration

Merobox can integrate with authentication services using Traefik proxy:

```bash
# Start nodes with auth service
merobox run --auth-service --count 2
```

This automatically:
- Starts Traefik proxy (`traefik:v2.10`)
- Starts auth service (`ghcr.io/calimero-network/calimero-auth:latest`)
- Creates Docker networks (`calimero_web`, `calimero_internal`)
- Configures nip.io DNS resolution
- Sets up forward authentication middleware

**Access patterns:**
- Node 1 API: `http://calimero-node-1.127.0.0.1.nip.io/jsonrpc` (protected)
- Node 1 Dashboard: `http://calimero-node-1.127.0.0.1.nip.io/admin-dashboard` (public)
- Auth Service: `http://localhost/auth/` (authentication endpoints)

### Testing Support

Merobox provides Python testing fixtures for integration tests:

```python
from merobox.testing import cluster

# Context manager
with cluster(count=2, prefix="ci") as env:
    node1 = env.nodes[0]
    node2 = env.nodes[1]
    
    # Use nodes in your tests
    response = await client.list_contexts(node1)
    assert len(response.data) == 0

# Pytest fixture
import pytest
from merobox.testing import cluster_fixture

@pytest.fixture(scope="session")
def calimero_cluster(cluster_fixture):
    yield cluster_fixture(count=3, prefix="test")

def test_my_app(calimero_cluster):
    node = calimero_cluster.nodes[0]
    # Run your tests
```

### Use Cases

- **Local Development** - Spin up local nodes for development and testing
- **Integration Testing** - Multi-node test scenarios with automated workflows
- **CI/CD Pipelines** - Automated testing in CI environments
- **Demo Environments** - Quick setup for demonstrations
- **Network Simulation** - Test P2P synchronization with multiple nodes

### Related Documentation

- **Repository**: [`calimero-network/merobox`](https://github.com/calimero-network/merobox)
- **PyPI Package**: [`merobox`](https://pypi.org/project/merobox/)
- **README**: [`merobox/README.md`](https://github.com/calimero-network/merobox/blob/master/README.md)

## ABI Codegen

ABI Codegen (`@calimero-network/abi-codegen`) generates TypeScript client code and type definitions from Rust application ABI manifests. It parses WASM-ABI v1 manifest files and generates fully-typed TypeScript clients for interacting with your Calimero applications.

### Features

- **TypeScript Generation** - Fully-typed client classes and type definitions
- **WASM-ABI v1 Support** - Parses standard ABI manifest format
- **Method Generation** - Generates methods for all Rust functions
- **Event Types** - Generates TypeScript types for events
- **Error Types** - Generates error types for method errors
- **CLI & Programmatic** - Use as CLI tool or import programmatically

### Installation

```bash
npm install @calimero-network/abi-codegen
```

### Quick Start

#### CLI Usage

```bash
# Basic usage
npx calimero-abi-codegen -i abi.json -o src

# With custom client name
npx calimero-abi-codegen -i abi.json -o src --client-name MyClient

# Validate ABI manifest only (no code generation)
npx calimero-abi-codegen --validate -i abi.json

# Derive client name from WASM file
npx calimero-abi-codegen -i abi.json -o src --name-from kv_store.wasm
```

#### CLI Options

- `-i, --input <file>` - Input ABI JSON file (default: `abi.json`)
- `-o, --outDir <dir>` - Output directory for generated files (default: `src`)
- `--client-name <Name>` - Custom client class name (default: `Client`)
- `--name-from <path>` - Derive client name from file path (e.g., WASM file)
- `--import-path <path>` - Custom import path for CalimeroApp and Context (default: `@calimero-network/calimero-client`)
- `--validate` - Validate ABI manifest only (no code generation)
- `-h, --help` - Show help message

### Programmatic Usage

```typescript
import { loadAbiManifestFromFile } from '@calimero-network/abi-codegen/parse';
import { generateTypes } from '@calimero-network/abi-codegen/generate/types';
import { generateClient } from '@calimero-network/abi-codegen/generate/client';

// Load ABI manifest
const manifest = loadAbiManifestFromFile('./abi.json');

// Generate TypeScript types
const typesContent = generateTypes(manifest);

// Generate client class
const clientContent = generateClient(manifest, 'MyClient');

// Write to files
await fs.writeFile('src/types.ts', typesContent);
await fs.writeFile('src/MyClient.ts', clientContent);
```

### Generated Files

ABI Codegen generates two files:

1. **types.ts** - TypeScript type definitions for all types, events, and errors
2. **{ClientName}.ts** - Client class with methods for all Rust functions

#### Example Generated Client

```typescript
import { CalimeroApp, Context } from '@calimero-network/calimero-client';

// Generated types
export interface SetValueArgs {
  key: string;
  value: string;
}

export interface GetValueArgs {
  key: string;
}

export interface ItemAddedEvent {
  key: string;
  value: string;
  timestamp: number;
}

// Generated client
export class KvStoreClient {
  constructor(
    private app: CalimeroApp,
    private context: Context
  ) {}

  async setValue(args: SetValueArgs): Promise<void> {
    await this.app.mutate({
      contextId: this.context.id,
      method: 'set_value',
      argsJson: args,
      executorPublicKey: this.context.executorPublicKey,
    });
  }

  async getValue(args: GetValueArgs): Promise<string | null> {
    const response = await this.app.query({
      contextId: this.context.id,
      method: 'get_value',
      argsJson: args,
      executorPublicKey: this.context.executorPublicKey,
    });
    return response.result as string | null;
  }
}
```

### ABI Manifest Format

ABI manifests follow the WASM-ABI v1 specification:

```json
{
  "version": "1",
  "methods": [
    {
      "name": "set_value",
      "args": {
        "key": "string",
        "value": "string"
      },
      "returns": null,
      "errors": []
    },
    {
      "name": "get_value",
      "args": {
        "key": "string"
      },
      "returns": "string | null",
      "errors": []
    }
  ],
  "events": [
    {
      "name": "ItemAdded",
      "payload": {
        "key": "string",
        "value": "string",
        "timestamp": "number"
      }
    }
  ],
  "types": {
    "SetValueArgs": {
      "fields": {
        "key": "string",
        "value": "string"
      }
    }
  }
}
```

### Integration with Build Process

Add to your `package.json`:

```json
{
  "scripts": {
    "generate:client": "calimero-abi-codegen -i abi.json -o src/generated",
    "build": "npm run generate:client && npm run build:app"
  }
}
```

### Use Cases

- **Type Safety** - End-to-end type safety from Rust to TypeScript
- **API Generation** - Automatic client generation from Rust applications
- **Developer Experience** - Auto-complete and type checking in IDEs
- **Documentation** - Types serve as documentation for your API

### Related Documentation

- **Repository**: [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js)
- **NPM Package**: [`@calimero-network/abi-codegen`](https://www.npmjs.com/package/@calimero-network/abi-codegen)
- **README**: [`mero-devtools-js/README.md`](https://github.com/calimero-network/mero-devtools-js/blob/master/README.md)

## create-mero-app

`create-mero-app` scaffolds new Calimero applications by cloning the `kv-store` example repository and copying its files (excluding Git artifacts). It provides a ready-to-use boilerplate for building new Calimero applications.

### Features

- **Quick Scaffolding** - Generate new apps in seconds
- **kv-store Boilerplate** - Based on the proven kv-store example
- **Clean Output** - Excludes Git artifacts and node_modules
- **Package Name Setup** - Automatically configures package.json name

### Installation

No installation required - use via `npx`:

```bash
npx create-mero-app@latest my-app
```

### Quick Start

```bash
# Create a new app
npx create-mero-app@latest my-kv-store

# Navigate to the new app
cd my-kv-store

# Install dependencies
pnpm install

# Build the WASM application
cd logic
chmod +x ./build.sh
./build.sh

# Start the frontend
cd ../app
pnpm build
pnpm dev
```

### What Gets Generated

The tool clones the [`calimero-network/kv-store`](https://github.com/calimero-network/kv-store){:target="_blank"} repository and copies:

- **Rust Application** (`logic/`) - WASM application with CRDT state
- **React Frontend** (`app/`) - React application with TypeScript
- **Build Scripts** - Build scripts for Rust and TypeScript
- **Configuration** - TypeScript config, package.json, etc.
- **Workflows** (`workflows/`) - Merobox workflows for local testing

**Excluded:**
- `.git/` and `.github/` - Git artifacts
- `node_modules/` - Dependencies (installed via `pnpm install`)

### Project Structure

```
my-kv-store/
├── logic/              # Rust WASM application
│   ├── src/
│   │   └── lib.rs      # Main application logic
│   ├── Cargo.toml
│   └── build.sh        # Build script
├── app/                # React frontend
│   ├── src/
│   │   └── App.tsx     # Main React component
│   ├── package.json
│   └── vite.config.ts
├── workflows/          # Merobox workflows
│   └── local-network.yml
├── package.json        # Root package.json
└── README.md
```

### Customization

After scaffolding, customize your app:

1. **Update Application Logic** - Modify `logic/src/lib.rs` with your business logic
2. **Update Frontend** - Modify `app/src/App.tsx` with your UI
3. **Update Package Names** - Update `package.json` files with your project name
4. **Add Dependencies** - Install additional npm/Rust packages as needed

### Next Steps

1. **Build the WASM** - Compile Rust to WASM: `cd logic && ./build.sh`
2. **Generate TypeScript Client** - Use ABI codegen to generate client types
3. **Start Local Network** - Use Merobox to start local nodes: `merobox bootstrap run workflows/local-network.yml`
4. **Run Frontend** - Start the React app: `cd app && pnpm dev`
5. **Deploy** - Deploy your WASM to Calimero nodes and host your frontend

### Use Cases

- **Quick Prototyping** - Rapidly scaffold new application ideas
- **Learning** - Start with a working example to understand Calimero
- **Boilerplate** - Base template for new applications
- **Development** - Ready-to-use development environment

### Related Documentation

- **Repository**: [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js)
- **NPM Package**: [`create-mero-app`](https://www.npmjs.com/package/create-mero-app)
- **README**: [`mero-devtools-js/create-mero-app/README.md`](https://github.com/calimero-network/mero-devtools-js/blob/master/create-mero-app/README.md)
- **kv-store Example**: [`calimero-network/kv-store`](https://github.com/calimero-network/kv-store)

## Complete Development Workflow

A typical development workflow using all three tools:

### 1. Scaffold New Application

```bash
npx create-mero-app@latest my-app
cd my-app
pnpm install
```

### 2. Build and Test Locally

```bash
# Build WASM application
cd logic
chmod +x ./build.sh
./build.sh

# Generate TypeScript client from ABI
cd ..
npx calimero-abi-codegen -i abi.json -o app/src/generated

# Start local network with Merobox
merobox bootstrap run workflows/local-network.yml
```

### 3. Develop and Iterate

```bash
# Start frontend dev server
cd app
pnpm dev

# Make changes to Rust logic, rebuild
cd ../logic
./build.sh

# Regenerate TypeScript client
cd ..
npx calimero-abi-codegen -i abi.json -o app/src/generated
```

### 4. Test Workflow

```bash
# Run Merobox workflow for testing
merobox bootstrap run workflows/test-workflow.yml

# Or use Merobox in Python tests
python -m pytest tests/
```

## Related Topics

- [Client SDKs](client-sdks.md) - Client libraries for interacting with nodes
- [meroctl CLI](meroctl-cli.md) - Command-line interface for node management
- [SDK Guide](../builder-directory/sdk-guide.md) - Building Calimero applications
- [Core Apps Examples](../examples/core-apps-examples.md) - Reference implementations

