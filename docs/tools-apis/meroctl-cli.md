# meroctl CLI Reference

`meroctl` is the command-line interface for managing Calimero nodes, applications, contexts, and blobs. It provides a complete toolkit for development, deployment, and operations.

## Installation

```bash
# Installing from Calimero core repository.
# Builds your crate and copies the binary into ~/.cargo/bin, so you can run it from anywhere.
$: cargo install --path ./crates/meroctl
> Installed package meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl) (executable meroctl)
$: which meroctl
> /Users/X/.cargo/bin/meroctl

# Builds the binary inside the project only; it's not globally available unless you reference it explicitly.
$: cd crates/meroctl
$: cargo build --release
> Compiling meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl)
>     Finished release [optimized + debuginfo] target(s) in 10.35s
> Installing meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl)
> Installing /Users/X/Desktop/core/crates/meroctl/target/release/meroctl (executable)
> Installed package meroctl v0.1.0 (/Users/X/Desktop/core/crates/meroctl) (executable meroctl)

# Installation using Homebrew
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
$: meroctl --node <NODE_ID> app ls
# With values
$: meroctl --node node1 app ls
> ╭──────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────┬─────────┬────────────────────────────────────────────────────╮
> │ ID                                           ┆ Source                                                                             ┆ Size    ┆ Blob                                               │
> ╞══════════════════════════════════════════════╪════════════════════════════════════════════════════════════════════════════════════╪═════════╪════════════════════════════════════════════════════╡
> │ HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf ┆ file:///Users/X/Desktop/my-app/logic/res/kv_store.wasm                    ┆ 393258 ┆ Blob: 3pTxosDWbfLrsX6ifc6YPzTKJEpPHeoC5uZ5s2hpT4y2 │         │
> ╰──────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────┴─────────┴────────────────────────────────────────────────────╯

# Get application details
$: meroctl --node <NODE_ID> app get <APP_ID>
# With application ID
$: meroctl --node node1 app get HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf
> ╭──────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────┬─────────┬────────────────────────────────────────────────────╮
> │ ID                                           ┆ Name                                                             ┆ Version ┆ Description                                        │
> ╞══════════════════════════════════════════════╪══════════════════════════════════════════════════════════════════╪═════════╪════════════════════════════════════════════════════╡
> │ HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf ┆ file:///Users/X/Desktop/my-app/logic/res/kv_store.wasm ┆ 393258  ┆ Blob: 3pTxosDWbfLrsX6ifc6YPzTKJEpPHeoC5uZ5s2hpT4y2 │
> ╰──────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────┴─────────┴────────────────────────────────────────────────────╯

# Install application from WASM file
$: meroctl --node <NODE_ID> app install --path <PATH>
# With values
$: meroctl --node node1 app install --path res/my_app.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯

# Uninstall application
$: meroctl --node <NODE_ID> app uninstall <APP_ID>
# With values
$: meroctl --node node1 app uninstall A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo
> ╭─────────────────────────────────────────────────────────────────────────────────────╮
> │ Application Uninstalled                                                             │
> ╞═════════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully uninstalled application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰─────────────────────────────────────────────────────────────────────────────────────╯

# List packages
$: meroctl --node <NODE_ID> app list-packages
# With values
$: meroctl --node node1 app list-packages
> ╭───────────────────╮
> │ Package           │
> ╞═══════════════════╡
> │ com.example.myapp |
> ╰───────────────────╯

# List versions of a package
$: meroctl --node <NODE_ID app list-versions <PACKAGE_ID>
# With values
$: meroctl --node node1 app list-versions com.example.myapp

# Get latest version
$: meroctl --node <NODE_ID> app get-latest-version <PACKAGE_ID>
# With values
$: meroctl --node node1 app get-latest-version com.example.myapp
```

### Contexts (`context`)

Manage application contexts:

```bash
# List all contexts
meroctl --node <NODE_ID> context ls
# With values
$: meroctl --node node1 context ls
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+
> | Context ID                                   | Application ID                               | Root Hash                                            |
> +====================================================================================================================================================+
> | FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7 | HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf | Hash("6JEnmTSgubFJSNz2qinpysSPDU7UmfbgrYYg6DX3PJEg") |
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+

# Create new context
$: meroctl --node <NODE_ID> context create --protocol <PROTOCOL> --application-id <APP_ID>
# With values
$: meroctl --node node1 context create --protocol near --application-id HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf
+-------------------+----------------------------------------------+
| Context Created   | Value                                        |
+==================================================================+
| Context ID        | 5YkN8bjdjQTCAxgZCw4NZoDoCMb23of6Cx31stLdSFSA |
|-------------------+----------------------------------------------|
| Member Public Key | H1mK8HsfB8NKdoR8hdoc3BAMdy6wJMsea9eFvgpCTHxS |
+-------------------+----------------------------------------------+

# Delete context
$: meroctl --node <NODE_ID> context delete <CONTEXT_ID>
# With values
$: meroctl --node node1 context delete 5YkN8bjdjQTCAxgZCw4NZoDoCMb23of6Cx31stLdSFSA
> +----------------------------------------------+
> | Context Deleted                              |
> +==============================================+
> | Successfully deleted context (deleted: true) |
> +----------------------------------------------+

# Sync context state
$: meroctl --node <NODE_ID> context sync --context <CONTEXT_ID>
# With values
$: meroctl --node node1 context sync --context 5YkN8bjdjQTCAxgZCw4NZoDoCMb23of6Cx31stLdSFSA
> +-----------------------------+
> | Context Synced              |
> +=============================+
> | Successfully synced context |
> +-----------------------------+

# Manage context aliases
$: meroctl --node <NODE_ID> context alias set <ALIAS> <CONTEXT_ID>
# With values
$:  meroctl --node node1 context alias add demoalias 5YkN8bjdjQTCAxgZCw4NZoDoCMb23of6Cx31stLdSFSA
> +----------------------------+
> | Alias Created              |
> +============================+
> | Successfully created alias |
> +----------------------------+

# Get context by alias
$: meroctl --node node1 context alias get <ALIAS>
# With values
$: meroctl --node node1 context alias get demoalias                                   
> +--------------+----------------------------------------------+
> | Alias Lookup |                                              |
> +=============================================================+
> | Status       | Found                                        |
> |--------------+----------------------------------------------|
> | Value        | 5YkN8bjdjQTCAxgZCw4NZoDoCMb23of6Cx31stLdSFSA |
> +--------------+----------------------------------------------+
```

### Context Invitations

Invite specific node identity inside context or generate an open invitation:

```bash
# First from invitee node (node2) we create new identity that will be used in invitation from inviter node (node1)
$: meroctl --node <NODE_ID> context identity generate
$: meroctl --node node2 context identity generate
> +-----------------------------------------+----------------------------------------------+
> | Context Identity Generated              | Public Key                                   |
> +========================================================================================+
> | Successfully generated context identity | 3aagVkceXvNvEemP1NQsKY5WGwk7fC9W62tD5PtfDgPj |
> +-----------------------------------------+----------------------------------------------+
# We will run the command again as we need 2 identities for showing both simple invitation and open invitation
$: meroctl --node node2 context identity generate
> +-----------------------------------------+----------------------------------------------+
> | Context Identity Generated              | Public Key                                   |
> +========================================================================================+
> | Successfully generated context identity | EYf2aVV9oQ47xmYVrwqKwHfUzoMFKxy7gVc2jQVwYEDt |
> +-----------------------------------------+----------------------------------------------+

# Now from inviter node we create 2 contexts and for one we will use simple invitation and for other open invtation
$: meroctl --node node1 context create --protocol near --application-id BPKKsDeN8ZbqTK7nWnxg1HG3ZLtkk1MjYwo8FLkNQCvb
> +-------------------+----------------------------------------------+
> | Context Created   | Value                                        |
> +==================================================================+
> | Context ID        | A1fXGKB47azFyRjD5WvrFgacVi1bGaT43kBUgU8a9skv |
> |-------------------+----------------------------------------------|
> | Member Public Key | H1mK8HsfB8NKdoR8hdoc3BAMdy6wJMsea9eFvgpCTHxS |
> +-------------------+----------------------------------------------+
# And again for another context
$: meroctl --node node1 context create --protocol near --application-id BPKKsDeN8ZbqTK7nWnxg1HG3ZLtkk1MjYwo8FLkNQCvb
> +-------------------+----------------------------------------------+
> | Context Created   | Value                                        |
> +==================================================================+
> | Context ID        | 5t6awrTf5SpeuZq2xu6KrG7EsRV2Bwbd8mXdrL4ZVGj7 |
> |-------------------+----------------------------------------------|
> | Member Public Key | 6c2DkQ7e5JReEXJGcoJu3FaURUA1M79RiJQKHfcTXU1p |
> +-------------------+----------------------------------------------+

# Generate simple invitation for a specific node identity
$: meroctl --node <NODE_ID> conext invite <INVITEE_ID> --context <CONTEXT_ID> --as <INVITER_ID>
$: meroctl --node node1 context invite 3aagVkceXvNvEemP1NQsKY5WGwk7fC9W62tD5PtfDgPj --context 5t6awrTf5SpeuZq2xu6KrG7EsRV2Bwbd8mXdrL4ZVGj7 --as 6c2DkQ7e5JReEXJGcoJu3FaURUA1M79RiJQKHfcTXU1p
> Invitation Created Successfully
> 
> Invitation Payload:
> FuNUfDCArA7DVrufGjxYZT9H...C14YYGyxaKsxw [truncated]
> ...

# Generate an open invitation for a context
$: meroctl --node <NODE_ID> context invite-by-open-invitation --context <CONTEXT_ID> --as <INVITER_ID>
$: meroctl --node node1 context invite-by-open-invitation --context 5t6awrTf5SpeuZq2xu6KrG7EsRV2Bwbd8mXdrL4ZVGj7 --as 6c2DkQ7e5JReEXJGcoJu3FaURUA1M79RiJQKHfcTXU1p
> Open Invitation Created Successfully
> 
> Open Invitation Payload:
> '{"invitation":{"inviter_identity":[83,67,36,101,211,66,17,153,95,105,246,80,213,6,7,188,225,170,123,105,54,237,86,62,36,36,40,24,161,98,133,171],"context_id":[72,133,175,43,80,67,164,165,28,20,178,44,244,37,15,82,239,106,14,14,176,60,81,209,76,182,137,33,104,185,31,38],"expiration_height":1000000999,"secret_salt":[1,110,24,146,16,162,27,233,156,58,66,175,251,136,170,24,222,233,119,228,77,133,244,70,241,205,156,146,50,64,47,19],"protocol":"near","network":"testnet","contract_id":"v0-6.config.calimero-context.testnet"},"inviter_signature":"ebb8cd05fc84dc8ef12978ac3c2ab89c727076f70a2384a8c5e14cbc9bda3c5b146b244ee0646f3c019ce079cd2c31c0679200bb744bbda4eb0c34c58746ec0d"}'

# Join a simple invitation bounded to inviter identity
$: meroctl --node <NODE_ID> context join <INVITATION_PAYLOAD>
$: meroctl --node node2 context join FuNUfDCArA7DVrufGjxYZT9H2tKmKXHkPTpZA7zbfef5bCK6nZ6Km5aZ9SHj2AzFiFTB9t74Er1QCyZRVehCqqn9BGLaf8B2JDtavm7t3f8eTw6FxzbapPAdtQwZQWYQm6dR8QP1VRSs72DPMuV8Xf85PdNC14YYGyxaKsxw
> +-----------------------------+
> | Context Joined              |
> +=============================+
> | Successfully joined context |
> +-----------------------------+

# Join an open invitation for a context
$: meroctl --node <NODE_ID> context join-by-open-invitation --as <INVITEE_ID> <INVITATION_PAYLOAD_JSON>
$: meroctl --node node2 context join-by-open-invitation --as EYf2aVV9oQ47xmYVrwqKwHfUzoMFKxy7gVc2jQVwYEDt '{"invitation":{"inviter_identity":[83,67,36,101,211,66,17,153,95,105,246,80,213,6,7,188,225,170,123,105,54,237,86,62,36,36,40,24,161,98,133,171],"context_id":[72,133,175,43,80,67,164,165,28,20,178,44,244,37,15,82,239,106,14,14,176,60,81,209,76,182,137,33,104,185,31,38],"expiration_height":1000000999,"secret_salt":[1,110,24,146,16,162,27,233,156,58,66,175,251,136,170,24,222,233,119,228,77,133,244,70,241,205,156,146,50,64,47,19],"protocol":"near","network":"testnet","contract_id":"v0-6.config.calimero-context.testnet"},"inviter_signature":"ebb8cd05fc84dc8ef12978ac3c2ab89c727076f70a2384a8c5e14cbc9bda3c5b146b244ee0646f3c019ce079cd2c31c0679200bb744bbda4eb0c34c58746ec0d"}'
> +-----------------------------+
> | Context Joined              |
> +=============================+
> | Successfully joined context |
> +-----------------------------+
```

### Calling Methods (`call`)

Execute application methods:

```bash
# Call a mutation method
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON> \
  --as <IDENTITY_PUBLIC_KEY>

# With Values
$: meroctl --node node1 call add_item \
 --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
 --args '{"key": "hello", "value": "world"}' \
 --as FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS
> 🔍 JSON-RPC Request to http://127.0.0.1:2528/jsonrpc: {
> ...
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+

# Call a view method (read-only)
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON> \
  --as <IDENTITY_PUBLIC_KEY>

# With values
$: meroctl --node node1 call get_item \
  --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
  --args '{"key": "hello"}' \
  --as FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS
> 🔍 meroctl call output: {
>   jsonrpc: 2.0,
>   id: null,
>   result: {
>     output: world
>   }
> }
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+
```

### Blobs (`blob`)

Manage content-addressed blobs:

```bash
# List all blobs
$: meroctl --node <NODE_ID> blob ls
# With values
$: meroctl --node node1 blob ls
> +----------------------------------------------+---------------+
> | Blob ID                                      | Size          |
> +==============================================================+
> | 22ErroDqHZiCXmdYtaNMR9sg5Txi26Pv6YpFrowYCaWa | 4526656 bytes |
> |----------------------------------------------+---------------|

# Upload blob from file
$: meroctl --node <NODE_ID> blob upload \
  --file <PATH> \
  --context-id <CONTEXT>  # Optional: announce to context
# With values
$: meroctl --node node1 blob upload \
  --file demo.png \
  --context-id FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7
> Successfully uploaded blob
>  Blob ID: Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc
>  Size: 92646 bytes


# Download blob to file
$: meroctl --node <NODE_ID> blob download \
  --blob-id <BLOB_ID> \
  --output <PATH/FILE_NAME> \
  --context-id <CONTEXT_ID>  # Optional: network discovery
# With values
$: meroctl --node node1 blob download \
  --blob-id Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc \
  --output demo-download.png \
  --context-id FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7
> Successfully downloaded blob
>   Blob ID: Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc
>   Saved to: demo-download.png
>   Size: 92646 bytes


# Get blob information
$: meroctl --node <NODE_ID> blob info --blob-id <BLOB_ID>
# With values
$: meroctl --node node1 blob info --blob-id Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc
> +----------------------------------------------+--------------+-----------+------------------------------------------------------------------+
> | Blob ID                                      | Size (bytes) | MIME Type | Hash                                                             |
> +============================================================================================================================================+
> | Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc | 92646        | image/png | 6b57338c4ee6d14d66119446eed400bb07273a26fb5b568e9e571a129c986eae |
> +----------------------------------------------+--------------+-----------+------------------------------------------------------------------+

# Delete blob
$: meroctl --node <NODE_ID> blob delete --blob-id <BLOB_ID>
# With values
$: meroctl --node node1 blob delete --blob-id Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc
> Successfully deleted blob 'Hwj5FN784Zj9MV5muSQ5JWrm1iQiG75Exci3ffppY4dc'

```

### Peers (`peers`)

Manage peer connections:

```bash
# List connected peers
$: meroctl --node <NODE_ID> peers
# With values
$: meroctl --node node1 peers
> +-----------------+-------+
> | Peers Count     | Count |
> +=========================+
> | Connected peers | 35    |
> +-----------------+-------+
```

## Output Formats

```bash
# Human output (default)
$: meroctl --output-format human --node <NODE_ID> context ls
# With values
$: meroctl --output-format human --node node1 context ls
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+
> | Context ID                                   | Application ID                               | Root Hash                                            |
> +====================================================================================================================================================+
> | 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9 | EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw | Hash("8cJivRyeGKQhk2zTAPXSZ4NH6AeuvEffpyXjwWa91KuH") |
> |----------------------------------------------+----------------------------------------------+------------------------------------------------------|
> | FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7 | HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf | Hash("6JEnmTSgubFJSNz2qinpysSPDU7UmfbgrYYg6DX3PJEg") |
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+

# JSON output
$: meroctl --output-format json --node <NODE_ID> context ls
# With values
$: meroctl --output-format json --node node1 context ls
{"data":{
  "contexts":[
  { "id":"9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9",
    "applicationId":"EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw",
    "rootHash":"8cJivRyeGKQhk2zTAPXSZ4NH6AeuvEffpyXjwWa91KuH",
    "dagHeads":[[123,252,41,250,163,7,21,176,33,33,34,91,39,5,221,91,92,210,144,30,189,216,130,138,246,229,189,191,113,11,228,196]]
  },
  { "id":"FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7",
    "applicationId":"HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf",
    "rootHash":"6JEnmTSgubFJSNz2qinpysSPDU7UmfbgrYYg6DX3PJEg",
    "dagHeads":[[15,10,180,62,244,86,70,185,211,94,229,62,139,252,124,29,104,5,4,85,135,204,28,220,45,32,8,155,200,35,5,27]]
  }
  ]}
}
```

## Troubleshooting

### Common Errors

- **"Node not found"**: Check node alias in `~/.calimero/config.toml` or use `--api` flag
- **"Context not found"**: Verify context ID with `context ls`
- **"Method not found"**: Check application source logic or ABI
- **"Permission denied"**: Verify executor public key has access to context

## Deep Dives

For detailed CLI documentation:

- **Source Code**: [`core/crates/meroctl`](https://github.com/calimero-network/core/tree/master/crates/meroctl){:target="_blank"} - Full implementation
- **Examples**: See `EXAMPLES` constants in source files for more usage patterns

## Related Topics

- [Applications](../core-concepts/applications.md) - Building applications that work with CLI
- [Contexts](../core-concepts/contexts.md) - Understanding context operations
- [Operator Track](../operator-track/index.md) - Running and managing nodes

