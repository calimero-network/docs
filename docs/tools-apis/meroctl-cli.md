# meroctl CLI Reference

`meroctl` is the command-line interface for managing Calimero nodes, applications, contexts, and blobs. It provides a complete toolkit for development, deployment, and operations.

## Installation

```bash
Installing from Calimero core repository.
Builds your crate and copies the binary into ~/.cargo/bin, so you can run it from anywhere.
$: cargo install --path ./crates/meroctl
> Installed package meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl) (executable meroctl)
$: which meroctl
> /Users/frandomovic/.cargo/bin/meroctl

Builds the binary inside the project only; it's not globally available unless you reference it explicitly.
$: cd crates/meroctl
$: cargo build --release
> Compiling meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl)
>     Finished release [optimized + debuginfo] target(s) in 10.35s
> Installing meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl)
> Installing /Users/X/Desktop/core/crates/meroctl/target/release/meroctl (executable)
> Installed package meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl) (executable meroctl)

$: brew install meroctl
> ✔︎ JSON API cask.jws.json                             Downloaded   15.3MB/ 15.3MB
> ✔︎ JSON API formula.jws.json                          Downloaded   32.0MB/ 32.0MB
> ==> Fetching downloads for: meroctl
> ✔︎ Formula meroctl (0.10.0-rc.35)                       Verified     11.2MB/ 11.2MB
> ==> Installing meroctl from calimero-network/tap
> 🍺  /opt/homebrew/Cellar/meroctl/0.10.0-rc.35: 4 files, 22.5MB, built in 1 second
> ==> Running brew cleanup meroctl...
> Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP=1.
> Hide these hints with HOMEBREW_NO_ENV_HINTS=1 (see man brew)
```

## Configuration

### Node Connection

Connect to a node using one of these methods:

```bash
# Using node alias (configured in ~/.calimero/config.toml)
$: meroctl --node node1 <command>

# Using direct API URL
$: meroctl --api http://localhost:2528 <command>
```

### Environment Variables

```bash
# Set default config directory
export CALIMERO_HOME=~/.calimero

# Configure node aliases in ~/.calimero/config.toml
```

## Command Categories

### Applications (`app`)

Manage WASM applications on nodes:

```bash
# List all applications
meroctl --node node1 app ls$

# Get application details
meroctl --node node1 app get <app_id>

# Install application from WASM file
meroctl --node node1 app install \
  --path ./my-app.wasm \
  --application-id <app_id> \
  --context-id <context_id>

# Watch WASM file and auto-update contexts
meroctl --node node1 app watch <app_id> --path ./my-app.wasm

# Uninstall application
meroctl --node node1 app uninstall <app_id>

# List packages
meroctl --node node1 app list-packages

# List versions of a package
meroctl --node node1 app list-versions com.example.myapp

# Get latest version
meroctl --node node1 app get-latest-version com.example.myapp
```

### Contexts (`context`)

Manage application contexts:

```bash
# List all contexts
meroctl --node node1 context ls

# Create new context
meroctl --node node1 context create \
  --application-id <app_id>

# Create context in dev mode (with watch)
meroctl --node node1 context create \
  --watch <path> \
  --context-id <context_id>

# Get context details
meroctl --node node1 context get <context_id>

# Join a context via invitation
meroctl --node node1 context join \
  --context-id <context_id> \
  --invitation <invitation_data>

# Join via open invitation
meroctl --node node1 context join-open \
  --context-id <context_id>

# Invite identity to context
meroctl --node node1 context invite \
  --context-id <context_id> \
  --grantee-id <public_key>

# Create open invitation
meroctl --node node1 context invite-open \
  --context-id <context_id>

# Update context
meroctl --node node1 context update \
  --context-id <context_id> \
  --metadata <json>

# Delete context
meroctl --node node1 context delete <context_id>

# Watch context for changes
meroctl --node node1 context watch <context_id>

# Sync context state
meroctl --node node1 context sync <context_id>

# Manage context aliases
meroctl --node node1 context alias set <context_id> <alias>
meroctl --node node1 context alias get <alias>
meroctl --node node1 context use <alias>

# Manage context identity/permissions
meroctl --node node1 context identity grant \
  --context-id <context_id> \
  --grantee-id <public_key> \
  --permission ManageApplication

meroctl --node node1 context identity revoke \
  --context-id <context_id> \
  --grantee-id <public_key>
```

### Calling Methods (`call`)

Execute application methods:

```bash
# Call a mutation method
meroctl --node node1 call \
  --context-id <context_id> \
  --method set \
  --args '{"key": "hello", "value": "world"}' \
  --executor-public-key <public_key>

# Call a view method (read-only)
meroctl --node node1 call \
  --context-id <context_id> \
  --method get \
  --args '{"key": "hello"}'
```

### Blobs (`blob`)

Manage content-addressed blobs:

```bash
# List all blobs
meroctl --node node1 blob ls

# Upload blob from file
meroctl --node node1 blob upload \
  --file /path/to/file \
  --context-id <context_id>  # Optional: announce to context

# Download blob to file
meroctl --node node1 blob download \
  --blob-id <blob_id> \
  --output /path/to/output \
  --context-id <context_id>  # Optional: network discovery

# Get blob information
meroctl --node node1 blob info --blob-id <blob_id>

# Delete blob
meroctl --node node1 blob delete --blob-id <blob_id>
```

### Peers (`peers`)

Manage peer connections:

```bash
# List connected peers
meroctl --node node1 peers ls

# Get peer information
meroctl --node node1 peers get <peer_id>
```

### Node (`node`)

Node management operations:

```bash
# Get node status
meroctl --node node1 node status

# Get node information
meroctl --node node1 node info

# Health check
meroctl --node node1 node health
```

## Output Formats

```bash
# JSON output (default)
meroctl --node node1 context ls --output-format json

# Table output
meroctl --node node1 context ls --output-format table

# Plain text
meroctl --node node1 context ls --output-format plain
```

## Common Workflows

### Development Workflow

```bash
# 1. Start local node (via merobox or Docker)
merobox run --count 1

# 2. Install application
meroctl --node calimero-node-1 app install \
  --path ./build/my-app.wasm \
  --application-id my-app

# 3. Create context
meroctl --node calimero-node-1 context create \
  --application-id my-app \
  --context-id my-context

# 4. Watch for changes (auto-reload)
meroctl --node calimero-node-1 app watch my-app \
  --path ./build/my-app.wasm

# 5. Call methods
meroctl --node calimero-node-1 call \
  --context-id my-context \
  --method my_method \
  --args '{"arg": "value"}'
```

### Multi-Node Workflow

```bash
# Node 1: Create context
meroctl --node node1 context create --application-id my-app

# Node 1: Invite Node 2
meroctl --node node1 context invite \
  --context-id <context_id> \
  --grantee-id <node2_public_key>

# Node 2: Join context
meroctl --node node2 context join \
  --context-id <context_id> \
  --invitation <invitation_data>

# Both nodes can now call methods and sync state
```

### Blob Sharing Workflow

```bash
# Node 1: Upload blob and announce to context
meroctl --node node1 blob upload \
  --file ./document.pdf \
  --context-id <context_id>

# Output: blob_id: abc123...

# Node 2: Download blob (discovered via context)
meroctl --node node2 blob download \
  --blob-id abc123... \
  --output ./downloaded.pdf \
  --context-id <context_id>
```

## Troubleshooting

### Connection Issues

```bash
# Check node is running
meroctl --api http://localhost:2528 node health

# Verify authentication
meroctl --node node1 context ls
```

### Common Errors

- **"Node not found"**: Check node alias in `~/.calimero/config.toml` or use `--api` flag
- **"Context not found"**: Verify context ID with `context ls`
- **"Method not found"**: Check ABI with `app get <app_id>`
- **"Permission denied"**: Verify executor public key has access to context

## Deep Dives

For detailed CLI documentation:

- **Source Code**: [`core/crates/meroctl`](https://github.com/calimero-network/core/tree/master/crates/meroctl){:target="_blank"} - Full implementation
- **Examples**: See `EXAMPLES` constants in source files for more usage patterns

## Related Topics

- [Applications](../core-concepts/applications.md) - Building applications that work with CLI
- [Contexts](../core-concepts/contexts.md) - Understanding context operations
- [Operator Track](../operator-track/index.md) - Running and managing nodes

