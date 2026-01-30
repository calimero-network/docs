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
# Using pipx (recommended)
$: pipx --version
> 1.7.1

$: pipx install merobox
> Installing to existing venv 'merobox'
>  installed package merobox 0.2.13, installed using Python 3.13.3
>  These apps are now globally available:  merobox
> done! ✨ 🌟 ✨
```

**Option 2: Using Homebrew**

```bash
$: brew install calimero-network/tap/merobox
> ...
> 🍺  /opt/homebrew/Cellar/merobox/0.1.23: 4 files, 15.6MB, built in 0 seconds
> ==> Running `brew cleanup merobox`...

# Verify installation
$: merobox --version
> merobox, version 0.2.16
```

**Option 3: From source**

```bash
$: git clone https://github.com/calimero-network/merobox.git
> Cloning into 'merobox'...
> remote: Enumerating objects: 3979, done.
> ...
> Resolving deltas: 100% (2677/2677), done.
$: cd merobox
$: pipx install -e .
> Installing to existing venv 'merobox'
>   installed package merobox 0.3.4, installed using Python 3.11.14
>   These apps are now globally available
>     - merobox
> done! ✨ 🌟 ✨
```

### Quick Start

#### Basic Node Management

```bash
# Start a single Calimero node
$: merobox run --count 1
> ...
> ✓ Node calimero-node-1 initialized successfully
> Starting node calimero-node-1...

# Start multiple nodes
$: merobox run --count 2
> ...
> ✓ Node calimero-node-1 initialized successfully
> Starting node calimero-node-1...
> ...
> ✓ Node calimero-node-2 initialized successfully
> Starting node calimero-node-2...

# Start with custom ports
$: merobox run --name <NODE_ID> --base-port <BASE_PORT>
$: merobox run --name calimero-node-1 --base-port 2423
> ...
> - P2P Port: 2423
> ...

# List running nodes
$: merobox list
>                                                      Running Calimero Nodes                                                      
> ┏━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
> ┃ Name            ┃ Status  ┃ Image                               ┃ P2P Port ┃ RPC/Admin Port ┃ Chain ID  ┃ Created             ┃
> ┡━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━┩
> │ calimero-node-1 │ running │ ghcr.io/calimero-network/merod:edge │ 2423     │ 56928          │ testnet-1 │ 2026-01-29 11:09:37 │
> └─────────────────┴─────────┴─────────────────────────────────────┴──────────┴────────────────┴───────────┴─────────────────────┘


# Check node health
$: merobox health --node <NODE_ID>
$: merobox health --node calimero-node-1
> Checking health of node calimero-node-1 via http://localhost:56928
>                  Calimero Node Health Status                  
> ╭─────────────────┬────────┬───────────────┬───────┬─────────╮
> │ Node            │ Health │ Authenticated │ Peers │ Status  │
> ├─────────────────┼────────┼───────────────┼───────┼─────────┤
> │ calimero-node-1 │ alive  │ Unknown       │ 0     │ Healthy │
> ╰─────────────────┴────────┴───────────────┴───────┴─────────╯

# View node logs
$: merobox logs <NODE_ID> --follow
$: merobox logs calimero-node-1 --follow
> ...
> 2026-01-29T11:14:13.352058500Z [2m2026-01-29T11:14:13.351606Z[0m [34mDEBUG[0m [1mSwarm::poll[0m[2m:[0m [2mlibp2p_gossipsub::behaviour[0m[2m:[0m RANDOM PEERS: Got 0 peers
> 2026-01-29T11:14:13.352067750Z [2m2026-01-29T11:14:13.351628Z[0m [34mDEBUG[0m [1mSwarm::poll[0m[2m:[0m [2mlibp2p_gossipsub::behaviour[0m[2m:[0m Updating mesh, new mesh: {}
> ...

# Stop a node
$: merobox stop <NODE_ID>
$: merobox stop calimero-node-1
> ✓ Stopped and removed node calimero-node-1

# Remove all node data (destructive!)
$: merobox nuke --prefix calimero-node-1
> Found 1 Calimero node data directory(ies):
>  Calimero Node Data Directories  
> ╭──────────────────────┬────────╮
> │ Directory            │ Status │
> ├──────────────────────┼────────┤
> │ data/calimero-node-1 │ Found  │
> ╰──────────────────────┴────────╯
> Total data size: 848.6 KB

> ⚠️  WARNING: This will permanently delete ALL Calimero node data!
> This action cannot be undone.
> Type 'YES' to confirm deletion: YES
> Found 1 Calimero node data directory(ies)
> ✓ Found merod binary in PATH: /opt/homebrew/bin/merod
> Stopping Docker container calimero-node-1...
> Deleting 1 data directory(ies)...
> ✓ Successfully deleted 1 data directory(ies)
> Total space freed: 848.6 KB

> To start fresh, run:
>   merobox run
```

#### Application Management

```bash
# Install a WASM application on a node
$:  merobox install --node <NODE_ID> --dev --path <PATH_TO_WASM>
$:  merobox install --node calimero-node-1 --dev --path res/my_app.wasm
> ✓ Application installed successfully!
> Application ID: 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
```

#### Identity & Context Creation

```bash
# Merobox command for creating contexts
$: merobox context create --node <NODE_ID> --protocol <PROTOCOL> --application-id <APP_ID>

# Creating context with application ID from previous steps using NEAR protocol
$: merobox context create --node calimero-node-1 --protocol near --application-id 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
> Creating context for application 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s on node calimero-node-1

> ✓ Context created successfully!
> Context ID: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS
> Member Public Key: CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos

# Merobox command to view created context data
$: merobox context list --node calimero-node-1
> Listing contexts on node calimero-node-1

> Found 1 context(s):
> Fetching member public keys...
>                                                     Contexts                                                     
> ╭─────────────────────────────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────╮
> │ Context ID                                  │ Application ID                               │ Member Public Key                           │
> ├─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┤
> │ FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS│ 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx… │ CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos │
> ╰─────────────────────────────────────────────┴─────────────────────────────────────────────┴─────────────────────────────────────────────╯

# Merobox command for viewing context data
$: Getting context FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS from node calimero-node-1
> ✓ Context details:
> Context ID: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS
> Application ID: 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
> Root Hash: 3qKcevhyARug9bwrfn4mWWHyVdTYGEokgvxJ5NpJiFU9
```

### Interact with the Application

```bash
# Merobox - call a mutation command
$: merobox call --node <NODE_ID> --context-id <CONTEXT_ID> --function <METHOD_NAME> --args <ARGS_IN_JSN> --executor-key <IDENTITY_PUBLIC_KEY>

# Commands from previous steps 
$: merobox call --node calimero-node-1 --context-id FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS --function add_item --args '{"key": "hello", "value": "world"}' --executor-key CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos
> Using RPC endpoint: http://localhost:59603
> ...
> 🔍 JSON-RPC Parsed Response: {
>  jsonrpc: 2.0,
>  id: 1,
>  result: {
>    output: null
>  }}
> ╭─────────────────────────────────────────────────────── Function Call Result ────────────────────────────────────────────────────────╮
> │ Function call successful!                                                                                                           │
> │                                                                                                                                     │
> │ Function: add_item                                                                                                                  │
> │ Context: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS                                                                               │
> │ Node: calimero-node-1                                                                                                               │
> │ Result: {'id': '1', 'jsonrpc': '2.0', 'result': {'output': None}}                                                                   │
> ╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

# Merobox - call a view command
$: merobox call --node <NODE_ID> --context-id <CONTEXT_ID> --function <METHOD_NAME> --args <ARGS_IN_JSN> --executor-key <IDENTITY_PUBLIC_KEY>

# Commands from previous steps 
$: merobox call --node calimero-node-1 --context-id FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS --function get_item --args '{"key": "hello"}' --executor-key CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos
> Using RPC endpoint: http://localhost:59603
> ...
> 🔍 JSON-RPC Parsed Response: {
>  jsonrpc: 2.0,
>  id: 1,
>  result: {
>    output: world
>  }
> }
> ╭─────────────────────────────────────────────────────── Function Call Result ────────────────────────────────────────────────────────╮
> │ Function call successful!                                                                                                           │
> │                                                                                                                                     │
> │ Function: get_item                                                                                                                  │
> │ Context: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS                                                                               │
> │ Node: calimero-node-1                                                                                                               │
> │ Result: {'id': '1', 'jsonrpc': '2.0', 'result': {'output': 'world'}}                                                                │
> ╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

### Context Invitations

```bash
# Create new context identity we will use for context invitation
$: merobox identity generate --node <NODE_ID>

# From invitee node use following (calimero-node-2)
$: merobox identity generate --node calimero-node-2
> Generating new identity on node calimero-node-2 via http://localhost:2529
> Used endpoint: http://localhost:2529/admin-api/identity/context
>
> ✓ Identity generated successfully!
>                     New Identity Details                     
> ╭────────────┬──────────────────────────────────────────────╮
> │ Property   │ Value                                        │
> ├────────────┼──────────────────────────────────────────────┤
> │ Public Key │ 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek │
> ╰────────────┴──────────────────────────────────────────────╯

# From calimero-node-1 fetch context identity as it will be used for invitation
$: merobox identity list-identities --node <NODE_ID> --context-id <CONTEXT_ID>
$: merobox identity list-identities --node calimero-node-1 --context-id 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs
> Listing identities for context 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs on node calimero-node-1 via http://localhost:2528
> ╭────────────┬──────────────────────────────────────────────╮
> │ Identity   │ Value                                        │
> ├────────────┼──────────────────────────────────────────────┤
> │ Public Key │ i1ZPRqvQNE43e2gMtfbaX1zaJLk4ahBkxcTgHmShFXs  │
> ╰────────────┴──────────────────────────────────────────────╯

# From calimero-node-1 create invitation for calimero-node-2
$: merobox identity invite --node <NODE_ID> --context-id <CONTEXT_ID> --inviter-id <INVITER_IDENTITY> --invitee-id <INVITEE_IDENTITY>
$: merobox identity invite --node calimero-node-1 --context-id 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs --inviter-id i1ZPRqvQNE43e2gMtfbaX1zaJLk4ahBkxcTgHmShFXs --invitee-id 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek
> Inviting identity 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek to context 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs on node calimero-node-1 via http://localhost:2528
> Used endpoint: http://localhost:2528/admin-api/contexts/invite
>
> ✓ Identity invited successfully!
>                  Identity Invitation Details                 
> ╭────────────┬──────────────────────────────────────────────────────────────────────────╮
> │ Property   │ Value                                                                    │
> ├────────────┼──────────────────────────────────────────────────────────────────────────┤
> │ Context ID │ 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs                             │
> │ Inviter ID │ i1ZPRqvQNE43e2gMtfbaX1zaJLk4ahBkxcTgHmShFXs                              │
> │ Invitee ID │ 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek                             │
> │ Invitation │ 8XgbiMB8Sojkznngtagd1WCM3FDcYmwwpJdGWAbiMXPcdpWWJdGWADqRwm83aG938213DUGv │
> ╰────────────┴──────────────────────────────────────────────────────────────────────────╯

# From calimero-node-2 join invitation
$: merobox join context --node <NODE_ID> --context-id <CONTEXT_ID> --invitee-id <INVITEE_ID> --invitation <INVITATION_PAYLOAD>
$: merobox join context --node calimero-node-2 --context-id 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs --invitee-id 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek --invitation 8XgbiMB8Sojkznngtagd1WCM3FDcYmwwpJdGWAbiMXPcdpWWJdGWADqRwm83aG938213DUGv
> Joining context 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs with identity 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek on node calimero-node-2 via http://localhost:2529
> Context joined successfully!

# Invitations using Open Invitations
# Open Invitations - invitations that are not bounded by specific invitee id and can by used by any node. Once claimed (node joins the context), it stop being valid.
$: merobox identity invite-open --node <NODE_ID> --context-id <CONTEXT_ID> --inviter-id <INVITER_IDENTITY>
$: merobox identity invite-open --node calimero-node-1 --context-id 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs --inviter-id i1ZPRqvQNE43e2gMtfbaX1zaJLk4ahBkxcTgHmShFXs
> Creating open invitation for context 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs on node calimero-node-1
> Valid for 1000 blocks
> Used endpoint: http://localhost:2528/admin-api/dev/contexts/invite-open
> 
> ✓ Open invitation created successfully!
>                      Open Invitation Details                      
> ╭──────────────────┬──────────────────────────────────────────────╮
> │ Property         │ Value                                        │
> ├──────────────────┼──────────────────────────────────────────────┤
> │ Context ID       │ 6XwNgtagbiMB8SojkznnmWm83aG93HJPo5HJsGpnYDQs │
> │ Inviter ID       │ i1ZPRqvQNE43e2gMtfbaX1zaJLk4ahBkxcTgHmShFXs  │
> │ Valid for Blocks │ 1000                                         │
> ╰──────────────────┴──────────────────────────────────────────────╯
>
> Invitation Data:
> {
>   "data": {
>     "invitation": {
>       "context_id": [82, ...],
>       "contract_id": "v0-6.config.calimero-context.testnet",
>       "expiration_height": 1000000999,
>       "inviter_identity": [10, ...],
>       "network": "testnet",
>       "protocol": "near",
>       "secret_salt": [123, ...]
>     },
>     "inviter_signature": "8024d458e38d42970e89e24c046c9a2f3b13cc98727e5ec3d576113e2c4f02"
>   }
> }
> Save this invitation data to share with others who want to join.

# Join open invitation from calimero-node-2
$: merobox join open --node <NODE_ID> --invitee-id <INVITEE_ID> --invitation <INVITATION_PAYLOAD_JSON>
$: merobox join open --node calimero-node-2 --invitee-id 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek --invitation '{"data":{"invitation":{"c....'
> Joining context on node calimero-node-2 as 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek via open invitation
> Used endpoint: http://localhost:2529/admin-api/dev/contexts/join-open
>
> ✓ Successfully joined context via open invitation!
>                        Context Join Details                        
╭───────────────────┬──────────────────────────────────────────────╮
│ Property          │ Value                                        │
├───────────────────┼──────────────────────────────────────────────┤
│ Context ID        │ N/A                                          │
│ Member Public Key │ N/A                                          │
│ Invitee ID        │ 8XPcdpWW8213DUGvFd1WCM3FDcYmwwpJdGWADqRwD2ek │
│ Node              │ calimero-node-2                              │
╰───────────────────┴──────────────────────────────────────────────╯
```

### Workflow Orchestration

Merobox supports complex multi-step workflows defined in YAML files:

```yaml
# Core repository apps/kv-store example
# workflow.yml
description: Simple Store Application Workflow (Rust)
name: Simple Store App Test

force_pull_image: true

nodes:
  chain_id: testnet-1
  count: 1
  image: ghcr.io/calimero-network/merod:edge
  prefix: simple-store-node

steps:
  - name: Install Simple Store Application
    type: install_application
    node: simple-store-node-1
    path: "res/kv_store.wasm"
    dev: true
    outputs:
      app_id: applicationId

  - name: Create Simple Store Context
    type: create_context
    node: simple-store-node-1
    application_id: '{{app_id}}'
    params: '{}'
    outputs:
      context_id: contextId
      member_public_key: memberPublicKey

  - name: Create Identity on Node 2
    type: create_identity
    node: simple-store-node-2
    outputs:
      member_public_key_2: publicKey

  - name: Invite Node 2 from Node 1
    type: invite_identity
    node: simple-store-node-1
    context_id: '{{context_id}}'
    grantee_id: '{{member_public_key_2}}'
    granter_id: '{{member_public_key}}'
    capability: member
    outputs:
      invitation_2: invitation
  
  - name: Join Context from Node 2
    type: join_context
    node: simple-store-node-2
    context_id: '{{context_id}}'
    invitee_id: '{{member_public_key_2}}'
    invitation: '{{invitation_2}}'

  - name: Set Value from node 1
    type: call
    node: simple-store-node-1
    context_id: '{{context_id}}'
    executor_public_key: '{{member_public_key}}'
    method: set
    args:
      key: greeting
      value: hello-world

  - name: Set Value from node 2
    type: call
    node: simple-store-node-2
    context_id: '{{context_id}}'
    executor_public_key: '{{member_public_key_2}}'
    method: join_chat
    method: set
    args:
      key: greeting2
      value: hello-world2

  - name: Get Value
    type: call
    node: simple-store-node-1
    context_id: '{{context_id}}'
    executor_public_key: '{{member_public_key}}'
    method: get
    args:
      key: greeting
    outputs:
      store_result: result.output
  
  - name: Get Value
    type: call
    node: simple-store-node-2
    context_id: '{{context_id}}'
    executor_public_key: '{{member_public_key_2}}'
    method: get
    args:
      key: greeting2
    outputs:
      store_result2: result.output

  - name: Assert Value Matches
    type: json_assert
    statements:
      - 'equal({{store_result}}, "hello-world")'
  - name: Assert Value Matches
    type: json_assert
    statements:
      - 'equal({{store_result2}}, "hello-world2")'

stop_all_nodes: false
restart: false 
wait_timeout: 120
```

**Execute a workflow:**

```bash
$: merobox bootstrap run workflow.yml
> ...
> run_workflow: incoming log_level='debug'
> run_workflow: incoming rust_backtrace='0'
> WorkflowExecutor: resolved log_level='debug', binary_mode=False
> WorkflowExecutor: workflow_id='ad731613' (for test isolation)
> WorkflowExecutor: resolved rust_backtrace='0', binary_mode=False
>
> 🚀 Executing Workflow: Simple Store App Test
> ...
```

**Workflow steps:**

- `identity` - Create cryptographic identities and context invitations
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

- Node 1 API: `http://node1.127.0.0.1.nip.io/jsonrpc` (protected)
- Node 1 Dashboard: `http://node1.127.0.0.1.nip.io/admin-dashboard` (public)
- Auth Service: `http://localhost/auth/` (authentication endpoints)

### Use Cases

- **Local Development** - Spin up local nodes for development and testing
- **Integration Testing** - Multi-node test scenarios with automated workflows
- **CI/CD Pipelines** - Automated testing in CI environments
- **Demo Environments** - Quick setup for demonstrations
- **Network Simulation** - Test P2P synchronization with multiple nodes

### Related Documentation

- **Repository**: [`calimero-network/merobox`](https://github.com/calimero-network/merobox){:target="_blank"}
- **PyPI Package**: [`merobox`](https://pypi.org/project/merobox/){:target="_blank"}
- **README**: [`merobox/README.md`](https://github.com/calimero-network/merobox/blob/master/README.md){:target="_blank"}

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
$: npm install @calimero-network/abi-codegen
> ...
> dependencies:
> + @calimero-network/abi-codegen 1.0.0
```

### Quick Start

#### CLI Usage

```bash
# Basic usage
$: npx calimero-abi-codegen -i abi.json -o src

# With custom client name
$: npx calimero-abi-codegen -i abi.json -o src --client-name MyClient

# Validate ABI manifest only (no code generation)
$: npx calimero-abi-codegen --validate -i abi.json

# Derive client name from WASM file
$: npx calimero-abi-codegen -i abi.json -o src --name-from kv_store.wasm
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

- **Repository**: [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js){:target="_blank"}
- **NPM Package**: [`@calimero-network/abi-codegen`](https://www.npmjs.com/package/@calimero-network/abi-codegen){:target="_blank"}
- **README**: [`mero-devtools-js/README.md`](https://github.com/calimero-network/mero-devtools-js/blob/master/README.md){:target="_blank"}

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
$: npx create-mero-app@latest my-app
> ? Select backend template › - Use arrow-keys. Return to submit.
> ❯   Rust (kv-store)
>     JavaScript (kv-store-js)
> ...
> ✔ Select backend template › Rust (kv-store)
> ...
> Scaffolding project in /Users/X/Desktop/my-app
> Using template: Rust (kv-store)
> Cloning into '/var/folders/p2/_b7fvy792s3458_0jlf6r0jm0000gn/T/mero-create-SY6uxl/repo'...
> Done.
```

### Quick Start

```bash
# Create a new app
$: npx create-mero-app@latest my-kv-store
> Need to install the following packages:
> create-mero-app@0.2.0
> Ok to proceed? (y) Y
>
> ✔ Select backend template › Rust (kv-store)
> 
> Scaffolding project in /Users/X/Desktop/my-kv-store
> Using template: Rust (kv-store)
> Cloning into '/var/folders/p2/_b7fvy792s3458_0jlf6r0jm0000gn/T/mero-create-r9f8D4/repo'...
> Done.

> Next steps:
>   cd my-kv-store
>   pnpm install
>   pnpm dev

# Navigate to the new app
$: cd my-kv-store

# Install dependencies
$: pnpm install
> ...
> dependencies:
> + @calimero-network/mero-icons 0.0.4
> + @calimero-network/mero-ui 0.3.6
> 
> devDependencies:
> + chokidar-cli 3.0.0
> + concurrently 9.2.1
> + husky 9.0.11

# Build the WASM application
$: cd logic
$: chmod +x ./build.sh
$: ./build.sh
> info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
>   Compiling proc-macro2 v1.0.105
> ...
>  Finished `app-release` profile [optimized] target(s) in 17.93s

# Start the frontend
$: cd ../app
$: pnpm install && pnpm build
> ...
> dependencies:
> + @calimero-network/calimero-client 1.25.0-beta.1
> + @calimero-network/mero-icons 0.0.4
> ...
> kv-store-app@1.0.0 build /Users/frandomovic/Desktop/my-kv-store/app
> vite build
> ...
> ✓ built in 1.33s

$: pnpm dev
> ...
>  VITE v7.2.1  ready in 172 ms
>
>  ➜  Local:   http://localhost:5173/
> ...
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

1. **Build the WASM** - Compile Rust or TypeScript to WASM: `cd logic && ./build.sh`
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

- **Repository**: [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js){:target="_blank"}
- **NPM Package**: [`create-mero-app`](https://www.npmjs.com/package/create-mero-app){:target="_blank"}
- **README**: [`mero-devtools-js/create-mero-app/README.md`](https://github.com/calimero-network/mero-devtools-js/blob/master/create-mero-app/README.md){:target="_blank"}
- **kv-store Example**: [`calimero-network/kv-store`](https://github.com/calimero-network/kv-store){:target="_blank"}

## Related Topics

- [Client SDKs](client-sdks.md) - Client libraries for interacting with nodes
- [meroctl CLI](meroctl-cli.md) - Command-line interface for node management
- [SDK Guide](../builder-directory/sdk-guide.md) - Building Calimero applications
- [Core Apps Examples](../examples/core-apps-examples.md) - Reference implementations

