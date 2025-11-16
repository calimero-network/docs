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

| Tool | Reference | Notes |
| --- | --- | --- |
| Merobox | [`calimero-network/merobox`](https://github.com/calimero-network/merobox#readme) | Docker workflows for local multi-node networks and Application ID capture. |
| Mero Devtools JS | [`calimero-network/mero-devtools-js`](https://github.com/calimero-network/mero-devtools-js#readme) | Scaffolds, ABI generators, TypeScript helpers. |
| Design System | [`calimero-network/design-system`](https://github.com/calimero-network/design-system#readme) | Shared UI components and tokens. |
| Plugins | [`calimero-network/plugins`](https://github.com/calimero-network/plugins#readme) | Automation hooks and extension samples. |

## SDKs & Clients

| SDK | Reference | Notes |
| --- | --- | --- |
| JavaScript Client | [`calimero-network/calimero-client-js`](https://github.com/calimero-network/calimero-client-js#readme) | Browser/Node bindings, event streaming, auth helpers. |
| Python Client | [`calimero-network/calimero-client-py`](https://github.com/calimero-network/calimero-client-py#readme) | Python bindings, ABI tooling, automation recipes. |
| Rust SDK | [`calimero-network/core/calimero-sdk-js`](https://github.com/calimero-network/core/tree/main/calimero-sdk-js#readme) | App macros, storage primitives, state helpers. |

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




