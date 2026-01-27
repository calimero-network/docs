# Monitor & Debug

Observability and troubleshooting for Calimero nodes.

## Quick Health Checks

```bash
# View logs
$: merobox logs node1 --follow
> Logs for node1:
> 2026-01-27T14:22:15.387049501Z [2m2026-01-27T14:22:15.386824Z[0m [35mTRACE[0m [2mhickory_proto::rr::record_data[0m[2m:[0m reading TXT
> ....

# List contexts
$: meroctl --node node1 context list
> +--------------+----------------+---------------------+
> | Context ID   | Application ID | Root Hash           |
> +=====================================================+
> | <CONTEXT_ID> | <APPLICATION_ID> | Hash(<ROOT_HASH>) |
> +--------------+------------------+-------------------+
```

## Admin Dashboard

Access the web UI at `http://localhost:2528/admin-dashboard` (or your node URL).

**Features:**
- Context management
- Application installation
- Identity management
- Metrics and stats

## Monitoring Endpoints

```bash
# Health check
$: curl http://localhost:2528/admin-api/health
> {"data":{"status":"alive"}}

# List contexts
$: curl http://localhost:2528/admin-api/contexts
> {"data":
>    {"contexts":[
>        {
>            "id":"9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9",
>            "applicationId":"EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw",
>            "rootHash":"8cJivRyeGKQhk2zTAPXSZ4NH6AeuvEffpyXjwWa91KuH",
>            "dagHeads":[[123,252,41,250,163,7,21,176,33,33,34,91,39,5,221,91,92,210,144,30,189,216,130,138,246,229,189,191,113,11,228,196]]
>        },
>        {
>            "id":"FfHXVWRqbSc2wrU2tEeuLQxFcmcpcfZd8Qk9yQFkm7W7",
>            "applicationId":"HHQbab1Meo1GCUsjELf2WSt3os1WaPaA4oKEGxTFTYBf",
>            "rootHash":"6JEnmTSgubFJSNz2qinpysSPDU7UmfbgrYYg6DX3PJEg",
>            "dagHeads":[[15,10,180,62,244,86,70,185,211,94,229,62,139,252,124,29,104,5,4,85,135,204,28,220,45,32,8,155,200,35,5,27]]
>        }]
>    }}
```

## Logs

```bash
# View node logs
$: merobox logs node1
> Logs for node1:
> 2026-01-27T14:22:15.387049501Z [2m2026-01-27T14:22:15.386824Z[0m [35mTRACE[0m [2mhickory_proto::rr::record_data[0m[2m:[0m reading TXT
> ....

# Follow logs in real-time
$: merobox logs node1 --follow
> Logs for node1:
> 2026-01-27T14:22:15.387049501Z [2m2026-01-27T14:22:15.386824Z[0m [35mTRACE[0m [2mhickory_proto::rr::record_data[0m[2m:[0m reading TXT
> ....

# Or with Docker directly
$: docker logs calimero-node-1 --follow
> ...
> 2026-01-27T14:22:14.135154Z TRACE Swarm::poll:NetworkBehaviour::poll: netlink_proto::connection: forwarding responses to previous requests to the connection handle
> 2026-01-27T14:22:14.135161Z TRACE Swarm::poll:NetworkBehaviour::poll: netlink_proto::connection: forward_responses called
> 2026-01-27T14:22:14.135165Z TRACE Swarm::poll:NetworkBehaviour::poll: netlink_proto::connection: forward_responses done
> ...
```

## Troubleshooting

See [`core/crates/node/readme/troubleshooting.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/troubleshooting.md){:target="_blank"} for:

- Common issues and solutions
- Performance tuning
- Network problems
- Storage issues

## Metrics

Nodes expose metrics at:

- **Admin API**: `http://localhost:2528/admin-api/metrics`
- **Prometheus**: Configure in node settings

See [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md){:target="_blank"} for monitoring configuration.
