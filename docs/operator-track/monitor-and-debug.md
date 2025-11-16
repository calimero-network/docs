# Monitor & Debug

Observability and troubleshooting for Calimero nodes.

## Quick Health Checks

```bash
# Check node health
meroctl --node node1 health

# View logs
merobox logs node1 --follow

# List contexts
meroctl --node node1 context list
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
curl http://localhost:2528/admin-api/health

# Get peers count
curl http://localhost:2528/admin-api/peers-count

# List contexts
curl http://localhost:2528/admin-api/contexts
```

## Logs

```bash
# View node logs
merobox logs node1

# Follow logs in real-time
merobox logs node1 --follow

# Or with Docker directly
docker logs calimero-node-1 --follow
```

## Troubleshooting

See [`core/crates/node/readme/troubleshooting.md`](https://github.com/calimero-network/core/blob/master/crates/node/readme/troubleshooting.md) for:
- Common issues and solutions
- Performance tuning
- Network problems
- Storage issues

## Metrics

Nodes expose metrics at:
- **Admin API**: `http://localhost:2528/admin-api/metrics`
- **Prometheus**: Configure in node settings

See [`core/crates/node/README.md`](https://github.com/calimero-network/core/blob/master/crates/node/README.md) for monitoring configuration.
