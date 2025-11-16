# Tools & APIs

!!! info
    Every entry below links to its canonical README. Follow those for installation flags, API surfaces, and deeper guides.

Use this directory as a jumping-off point; it shows you **what exists** and **where to learn more** without duplicating repo docs.

## Runtime & Admin

| Tool | Reference | Notes |
| --- | --- | --- |
| `merod` | [`calimero-network/core`](https://github.com/calimero-network/core#readme) | Node runtime orchestrating WASM apps, storage, networking, RPC. |
| `meroctl` | [CLI Reference](meroctl-cli.md) | Command-line surface for context lifecycle, deployment, diagnostics. See also [`core/crates/meroctl`](https://github.com/calimero-network/core/tree/master/crates/meroctl) for source code. |
| Admin Dashboard | [`calimero-network/admin-dashboard`](https://github.com/calimero-network/admin-dashboard#readme) | Web UI for member management, metrics, alerts. |

## Developer Tooling

!!! tip "Developer Tools Guide"
    For comprehensive documentation on Merobox, ABI Codegen, and create-mero-app, see the [Developer Tools Guide](developer-tools.md).

| Tool | Reference | Notes |
| --- | --- | --- |
| Developer Tools | [Developer Tools Guide](developer-tools.md) | Comprehensive guide to Merobox (local networks), ABI Codegen (TypeScript generation), and create-mero-app (boilerplate scaffolding). |
| Merobox | [`calimero-network/merobox`](https://github.com/calimero-network/merobox#readme) | Docker workflows for local multi-node networks, testing, and workflow orchestration. |
| ABI Codegen | [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js#readme) | Generate TypeScript clients from Rust application ABIs. |
| create-mero-app | [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js#readme) | Scaffold new Calimero apps from kv-store boilerplate. |
| Design System | [`calimero-network/design-system`](https://github.com/calimero-network/design-system#readme) | Shared UI components and tokens. |
| Plugins | [`calimero-network/plugins`](https://github.com/calimero-network/plugins#readme) | Automation hooks and extension samples. |

## SDKs & Clients

!!! tip "Client SDKs Guide"
    For comprehensive documentation on all three client SDKs (Rust, Python, JavaScript), see the [Client SDKs Guide](client-sdks.md).

| SDK | Reference | Notes |
| --- | --- | --- |
| Client SDKs | [Client SDKs Guide](client-sdks.md) | Comprehensive guide to Rust, Python, and JavaScript client SDKs for interacting with Calimero nodes. |
| JavaScript Client | [`calimero-network/calimero-client-js`](https://github.com/calimero-network/calimero-client-js#readme) | Browser/Node bindings, event streaming, auth helpers. ✅ Full authentication support. |
| Python Client | [`calimero-network/calimero-client-py`](https://github.com/calimero-network/calimero-client-py#readme) | Python bindings, ABI tooling, automation recipes. ⚠️ Authentication support planned. |
| Rust Client | [`calimero-network/core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client) | Rust client SDK for CLI tools and sidecar services. ⚠️ Authentication support planned. |
| Rust SDK | [`calimero-network/core/crates/sdk`](https://github.com/calimero-network/core/tree/master/crates/sdk) | App macros, storage primitives, state helpers. For building Calimero applications. |

## Automation & Workflows

| Resource | Reference | Notes |
| --- | --- | --- |
| Merobox Workflows | [`workflows/` in example repos](https://github.com/calimero-network/battleships/tree/main/workflows) | Reusable network topologies for local + CI. |
| Docs & CI scripts | [`calimero-network/docs`](https://github.com/calimero-network/docs#readme) | MkDocs site, link policies, CI glue. |
| Homebrew Tap | [`calimero-network/homebrew-tap`](https://github.com/calimero-network/homebrew-tap#readme) | Package distribution for CLI and runtime binaries. |

## Advanced & Research

| Project | Reference | Notes |
| --- | --- | --- |
| MPC Signer | [`calimero-network/experiments/mpc-signer`](https://github.com/calimero-network/experiments/tree/main/mpc-signer#readme) | Threshold signing, custody experiments, ZK exploration. |
| Escrow | [`calimero-network/escrow`](https://github.com/calimero-network/escrow#readme) | Bridge contracts, marketplace patterns, L1 attestations. |

!!! tip
    Pick a tool, follow its README end-to-end, then link back into MKDocs when you need a refresher. These pages stay minimal by design.




