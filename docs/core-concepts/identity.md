# Identity

Calimero uses **cryptographic identities** to manage access control and authentication across the network. Each participant has one or more identities that prove ownership and grant permissions.

## Identity Model

Calimero supports a hierarchical identity model:

```
Root Key (Master Identity)
├── Client Key 1 (for Context A)
├── Client Key 2 (for Context B)
└── Client Key 3 (for Context C)
```

### Root Keys

A **root key** is the master identity for a user or node. It's typically:

- Generated from a blockchain wallet (NEAR, Ethereum, etc.)
- Used for high-level operations (creating contexts, managing memberships)
- Stored securely (hardware wallet, keychain, etc.)

### Client Keys

**Client keys** are derived from root keys and used for:

- Executing methods in specific contexts
- Signing transactions and deltas
- Proving membership in contexts

**Benefits:**
- **Isolation**: Compromise of one client key doesn't affect others
- **Revocation**: Can revoke access per-context without changing root key
- **Privacy**: Different keys for different contexts

## Identity Generation

### Creating a New Identity

```bash
# Generate a new identity on a node
meroctl identity create --node-name node1

# Output:
# Public Key: ed25519:abc123...
# Stored in: ~/.calimero/identities/node1/
```

**What happens:**
- Ed25519 keypair is generated
- Private key is stored securely on the node
- Public key is returned for sharing

### Using Blockchain Wallets

Calimero integrates with blockchain wallets for identity:

| Protocol | Wallet Integration | Identity Source |
| --- | --- | --- |
| **NEAR** | NEAR Wallet, Ledger | NEAR account ID + signature |
| **Ethereum** | MetaMask, WalletConnect | Ethereum address + signature |
| **ICP** | Internet Identity, Plug | ICP principal + signature |
| **Stellar** | Stellar Wallet | Stellar account + signature |

**Authentication Flow:**
1. User connects wallet (e.g., MetaMask)
2. User signs a challenge message
3. Calimero verifies signature against blockchain
4. Identity is established and JWT token issued

## Authentication Flows

### NEAR Protocol

```typescript
// Client-side authentication
import { connect, keyStores } from 'near-api-js';

const keyStore = new keyStores.BrowserLocalStorageKeyStore();
const near = await connect({
  networkId: 'testnet',
  keyStore,
});

// Sign challenge
const account = await near.account('user.near');
const signature = await account.connection.signer.signMessage(
  challenge,
  account.accountId,
  'testnet'
);

// Send to Calimero auth service
const jwt = await fetch('/auth/near', {
  method: 'POST',
  body: JSON.stringify({ accountId, signature, challenge }),
});
```

### Ethereum

```typescript
// Using ethers.js
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();

// Sign challenge
const signature = await signer.signMessage(challenge);

// Send to Calimero auth service
const jwt = await fetch('/auth/ethereum', {
  method: 'POST',
  body: JSON.stringify({ address, signature, challenge }),
});
```

### ICP (Internet Computer)

```typescript
// Using @dfinity/agent
import { Actor, HttpAgent } from '@dfinity/agent';

const agent = new HttpAgent({ identity });
const principal = await agent.getPrincipal();

// Sign challenge using Internet Identity
const signature = await agent.sign(challenge);

// Send to Calimero auth service
const jwt = await fetch('/auth/icp', {
  method: 'POST',
  body: JSON.stringify({ principal, signature, challenge }),
});
```

## JWT Tokens

After authentication, Calimero issues **JWT (JSON Web Token)** tokens:

```json
{
  "context_id": "context-123",
  "executor_public_key": "ed25519:abc...",
  "permissions": ["read", "write", "execute"],
  "exp": 1234567890
}
```

**Token usage:**
- Included in API requests: `Authorization: Bearer <token>`
- Proves identity and permissions
- Expires after configured time
- Refreshable via refresh token

## Key Management

### Hierarchical Key Management

```
Root Key (NEAR account: alice.near)
│
├── Context A Client Key
│   ├── Can execute methods in Context A
│   └── Can read/write Context A state
│
├── Context B Client Key
│   ├── Can execute methods in Context B
│   └── Can read/write Context B state
│
└── Context C Client Key (revoked)
    └── No longer has access
```

**Benefits:**
- **Granular Control**: Different keys for different contexts
- **Easy Revocation**: Revoke one key without affecting others
- **Audit Trail**: Track which key performed which action

### Key Revocation

```bash
# Revoke a client key's access to a context
meroctl context revoke \
  --context-id <CONTEXT_ID> \
  --member-id <CLIENT_KEY_PUBLIC_KEY>
```

**What happens:**
- Key is removed from context membership
- Key can no longer sign transactions for that context
- Existing transactions remain valid (immutable history)
- Root key remains unaffected

## Wallet Adapters

Calimero provides wallet adapters for easy integration:

### JavaScript Client

```typescript
import { ClientLogin } from '@calimero-network/calimero-client';

// Automatically handles wallet connection and authentication
<ClientLogin 
  successRedirect={() => navigate('/dashboard')}
/>
```

**Supported wallets:**
- NEAR Wallet
- MetaMask (Ethereum)
- WalletConnect
- Internet Identity (ICP)

### Python Client

```python
from calimero_client_py import create_connection, AuthMode

# Connect with wallet authentication
connection = create_connection(
    base_url="https://node.calimero.network",
    auth_mode=AuthMode.WALLET,
    wallet_type="near"  # or "ethereum", "icp"
)
```

## Best Practices

1. **Use Client Keys**: Don't use root keys directly for context operations
2. **Rotate Keys**: Periodically rotate client keys for security
3. **Secure Storage**: Store private keys in secure keychains, never in code
4. **Multi-Sig Support**: Use multi-signature wallets for high-value contexts
5. **Key Backup**: Backup root keys securely (hardware wallet, paper backup)

## Deep Dives

For detailed identity documentation:

- **Identity Contracts**: [`contracts` README](https://github.com/calimero-network/contracts#readme) - Smart contract implementations
- **Auth Service**: [`core/crates/auth/README.md`](https://github.com/calimero-network/core/blob/master/crates/auth/README.md) - Authentication service
- **Client SDKs**: [Tools & APIs](../tools-apis/index.md) - Wallet integration guides

## Related Topics

- [Contexts](contexts.md) - Where identities are used
- [Applications](applications.md) - What identities can access
- [Architecture Overview](architecture.md) - How identity fits into the system
