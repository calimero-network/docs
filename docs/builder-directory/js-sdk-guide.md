# Calimero JavaScript SDK Guide

Build Calimero services using **TypeScript/JavaScript**. The JavaScript SDK compiles your code to WebAssembly using QuickJS, enabling you to build distributed applications without writing Rust.

> ⚠️ **Experimental:** The JavaScript SDK is still evolving. Expect breaking changes while we stabilize the toolchain.

## Overview

The JavaScript SDK (`calimero-sdk-js`) consists of two main packages:

- **`@calimero-network/calimero-sdk-js`** - Decorators, CRDT collections, event system, and environment bindings
- **`@calimero-network/calimero-cli-js`** - Build toolchain (Rollup → QuickJS → WASM)

**Key features:**

- Write services in TypeScript/JavaScript instead of Rust
- Same CRDT collections as Rust SDK
- Automatic conflict resolution
- Event-driven architecture
- Private storage for node-local data

## Architecture

### Build Pipeline

```mermaid
flowchart LR
    TS[TypeScript<br/>Source] --> BUILD[Build<br/>Bundle]
    BUILD --> QJS[QuickJS<br/>Compile]
    QJS --> WASM[WASI-SDK<br/>to WASM]
    WASM --> OPT[Optimize<br/>~500KB]
    
    style TS fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style BUILD fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style QJS fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style WASM fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style OPT fill:#000000,stroke:#00ff00,stroke-width:4px,color:#ffffff
```

### Runtime Execution

```mermaid
flowchart LR
    JS[JavaScript<br/>Your code] --> SDK[SDK<br/>Decorators]
    SDK --> QJS[QuickJS<br/>Runtime]
    QJS --> HOST[Host<br/>Functions]
    HOST --> RUNTIME[Calimero<br/>Runtime]
    
    style JS fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style SDK fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style QJS fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style HOST fill:#1a1a1a,stroke:#00ff00,stroke-width:3px,color:#ffffff
    style RUNTIME fill:#000000,stroke:#00ff00,stroke-width:4px,color:#ffffff
```

**How the SDK works:**

- Your TypeScript code runs inside QuickJS (a lightweight JavaScript engine)
- CRDT operations call host functions that interact with Rust storage
- State is serialized and synchronized across the network
- Events propagate to all peers automatically

## Getting Started

### Prerequisites

- Node.js 18+ with WASI support
- `pnpm` ≥ 8 (or npm/yarn)
- Access to a Calimero node (`merod`) and CLI (`meroctl`)

### TypeScript Project setup

> **NOTE**: There is also an npx command `npx create-mero-app my-app` which generates a template for Rust or Tyepscript application including frontend, application logic, scripts and workflows, see [Getting started](../getting-started/index.md/#__tabbed_3_1){:target="_blank"} for more information.

```bash
$: mkdir my-calimero-js-app
$: cd my-calimero-js-app
$: pnpm init -y
> Wrote to /Users/X/Desktop/my-calimero-js-app/package.json
>
> {
>   "name": "my-calimero-js-app",
>   "version": "1.0.0",
>   "description": "",
>   "main": "index.js",
>   "scripts": {
>    "test": "echo \"Error: no test specified\" && exit 1"
>   },
>   "keywords": [],
>   "author": "",
>   "license": "ISC"
> }


#Add following build script which will be used later to generate .WASM from the typescript application.
# package.json
{
  ...,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "calimero-sdk build src/index.ts -o build/my-calimero-js-app.wasm"
  },
  ...
}

$:  pnpm add typescript && npx tsc --init
> +
> Progress: resolved 4, reused 4, downloaded 0, added 1, done
> 
> dependencies:
> + typescript 5.9.3
> 
> Done in 3s
> 
> Created a new tsconfig.json
```

Update tsconfig.json with following settings
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./build",
    "rootDir": "./src",
    "composite": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"]
}

```

### Installation

```bash
$: pnpm add @calimero-network/calimero-sdk-js
> ...
> Progress: resolved 213, reused 145, downloaded 44, added 189, done
> node_modules/.pnpm/@calimero-network+calimero-sdk-js@0.2.3_typescript@5.9.3/node_modules/@calimero-network/calimero-sdk-js: Running postinstall script...
> dependencies:
> + @calimero-network/calimero-sdk-js 0.2.3

$: pnpm add -D @calimero-network/calimero-cli-js tslib
> ...
> devDependencies:
> + @calimero-network/calimero-cli-js ^0.3.0
> + tslib 2.8.1

# Use following command if post install doesn't trigger deps installation
$: cd node_modules/@calimero-network/calimero-cli-js && pnpm install-deps
> 🔧 Installing Calimero SDK build dependencies...
> ...

# Create index file
$: mkdir src && touch src/index.ts
```

**NPM Resources:**

- Calimero SDK JS - [NPM package](https://www.npmjs.com/package/@calimero-network/calimero-sdk-js){:target="_blank"}
- Calimero CLI JS - [NPM package](https://www.npmjs.com/package/@calimero-network/calimero-cli-js){:target="_blank"}

### Minimal Application Example

```typescript
// index.ts
import { State, Logic, Init, View } from '@calimero-network/calimero-sdk-js';
import { Counter } from '@calimero-network/calimero-sdk-js/collections';
import * as env from '@calimero-network/calimero-sdk-js/env';

@State
export class CounterApp {
  count: Counter = new Counter();
}

@Logic(CounterApp)
export class CounterLogic extends CounterApp {
  @Init
  static init(): CounterApp {
    env.log('Initializing counter');
    return new CounterApp();
  }

  increment(): void {
    env.log('Incrementing counter');
    this.count.increment();
  }

  @View()
  getCount(): bigint {
    return this.count.value();
  }
}
```

### Build & Deploy

```bash
# Build WASM from TypeScript
$: pnpm build
> my-calimero-js-app@1.0.0 build /Users/X/Desktop/my-calimero-js-app
> calimero-sdk build src/index.ts -o build/my-calimero-js-app.wasm

> [build] › …  awaiting  Extracting service methods...
> [build] › ✔  success   Contract built successfully: build/my-calimero-js-app.wasm (1456.35 KB)

# Install application wasm on the node
$: meroctl --node node1 app install \
  --path build/my-calimero-js-app.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯

# Create a context for installed application
$: $: meroctl --node node1 context create \
  --protocol near --application-id EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw
> +------------------------------+
> | Context Created              |
> +==============================+
> | Successfully created context |
> +------------------------------+

# View context ID and context identity
$: meroctl --node node1 context ls 
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+
> | Context ID                                   | Application ID                               | Root Hash                                            |
> +====================================================================================================================================================+
> | 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9 | EdQAQGNLHBpM8atH18re56RmxL676WCJZEZvCPdXQbbw | Hash("J6XbiySdR1cdcBYkHfxpdP4hFQ9aLvLSe2knvPW7SJxG") |
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+

$: meroctl --node node1 context identity list --context 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9
> +----------------------------------------------+------------------+
> | Identity                                     | Type             |
> +=================================================================+
> | E9X7upjmMoZB5FL79JSuxUY2i873DvZ5f7QkLcSat89e | Context Identity |
> +----------------------------------------------+------------------+

# Call methods
# Calling getCount to verify that the counter value is 0
$: meroctl --node node1 call getCount \
  --context 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9 \
  --as E9X7upjmMoZB5FL79JSuxUY2i873DvZ5f7QkLcSat89e
> ...
> "result": {
>    "output": "0"
>  }
> ...

# Calling increment which will increase the counter value to 1
$: meroctl --node node1 call increment \
 --context 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9 \
 --as E9X7upjmMoZB5FL79JSuxUY2i873DvZ5f7QkLcSat89e
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+

# Callin getCount to verify that the counter value is 1
$: meroctl --node node1 call getCount \
  --context 9MYohRkkpT1QXtBGAcXYeB7yTtWNeFrVieK47tV4TSx9 \
  --as E9X7upjmMoZB5FL79JSuxUY2i873DvZ5f7QkLcSat89e
> ...
> "result": {
>     "output": "1"
>   }
> ...
```

## Core Concepts

### Decorators

#### @State

Marks a class as application state:

```typescript
import { State } from '@calimero-network/calimero-sdk-js';
import { UnorderedMap, Counter } from '@calimero-network/calimero-sdk-js/collections';

@State
export class MyApp {
  items: UnorderedMap<string, string> = new UnorderedMap();
  viewCount: Counter = new Counter();
}
```

**Key points:**

- State is persisted and synchronized across nodes
- Initialize CRDT fields inline (runtime reuses persisted IDs)
- Don't use regular JavaScript objects for synchronized state

#### @Logic

Marks a class as application logic (methods):

```typescript
import { Logic, Init, Logic } from '@calimero-network/calimero-sdk-js';

@Logic(MyApp)
export class MyAppLogic extends MyApp {
  @Init
  static init(): MyApp {
    return new MyApp();
  }

  // Mutation method (changes state)
  addItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  // View method (read-only)
  @View()
  getItem(key: string): string | null {
    return this.items.get(key);
  }
}
```

**Key points:**

- Logic class extends State class
- `@Init` marks the initialization method (called once on context creation)
- Methods without `@View()` are mutations (generate deltas)
- Methods with `@View()` are read-only (no delta generated)

#### @View()

Marks read-only methods:

```typescript
@Logic(MyApp)
export class MyAppLogic extends MyApp {
  // View - read-only, no delta
  @View()
  getValue(): string {
    return this.register.get();
  }
}
```

**Benefits:**
- Faster execution (no persistence overhead)
- No redundant storage deltas
- Clear intent in API

#### @Event

Marks event classes:

```typescript
import { Event } from '@calimero-network/calimero-sdk-js';

@Event
export class ItemAdded {
  constructor(
    public key: string,
    public value: string,
  ) {}
}

// Emit an event inside a function
...
addItem(key: string, value: string): void {
    emit(new ItemAdded(key, value));
    this.items.set(key, value);
}
...
```

#### @Init

Marks the initialization method:

```typescript
@Logic(MyApp)
export class MyAppLogic extends MyApp {
  @Init
  static init(): MyApp {
    return new MyApp();
  }
}
```

**Requirements:**

- Must be static
- Must return an instance of State class
- Called once when context is created

### CRDT Collections

The JavaScript SDK provides the same CRDT collections as the Rust SDK:

#### UnorderedMap<K, V>

Key-value storage with Last-Write-Wins conflict resolution:

```typescript
import { UnorderedMap } from '@calimero-network/calimero-sdk-js/collections';

const map = new UnorderedMap<string, string>();

// Set value
map.set('key', 'value');

// Get value
const value = map.get('key'); // 'value' | undefined

// Check existence
const exists = map.has('key'); // boolean

// Remove entry
map.remove('key');

// Iterate
const entries = map.entries(); // [['key1', 'value1'], ['key2', 'value2']]
const keys = map.keys(); // ['key1', 'key2']
const values = map.values(); // ['value1', 'value2']

// Size
const size = map.entries().length;
```

#### Vector<T>

Ordered list maintaining insertion order:

```typescript
import { Vector } from '@calimero-network/calimero-sdk-js/collections';

const vec = new Vector<string>();

// Add element
vec.push('first');
vec.push('second');

// Get element
const item = vec.get(0); // 'first'

// Remove element
const last = vec.pop(); // 'second'

// Length
const len = vec.len(); // number
```

#### Counter

Distributed counter with automatic summation:

```typescript
import { Counter } from '@calimero-network/calimero-sdk-js/collections';

const counter = new Counter();

// Increment
counter.increment();
counter.incrementBy(5);

// Get value
const total = counter.value(); // bigint
```

#### LwwRegister<T>

Last-Write-Wins register for single values:

```typescript
import { LwwRegister } from '@calimero-network/calimero-sdk-js/collections';

const register = new LwwRegister<string>();

// Set value
register.set('hello');

// Get value
const value = register.get(); // 'hello' | null

// Get timestamp
const timestamp = register.timestamp(); // bigint
```

#### UnorderedSet<T>

Set with union-based merging:

```typescript
import { UnorderedSet } from '@calimero-network/calimero-sdk-js/collections';

const set = new UnorderedSet<string>();

// Add element
set.add('item'); // true on first insert

// Check membership
const has = set.has('item'); // boolean

// Remove element
set.delete('item');

// Get all values
const all = set.toArray(); // string[]

// Size
const size = set.size(); // number
```

### Nested CRDTs

CRDTs can be nested arbitrarily:

```typescript
@State
export class TeamMetrics {
  // Map of member → Map of metric → Counter
  memberMetrics: UnorderedMap<string, UnorderedMap<string, LwwRegister<Counter>>>;
  
  // Map of team → Set of members
  teams: UnorderedMap<string, UnorderedSet<string>>;
  
  // Vector of profiles (each with nested data)
  profiles: Vector<MemberProfile>;

  constructor() {
    this.memberMetrics = new UnorderedMap();
    this.teams = new UnorderedMap();
    this.profiles = new Vector();
  }
}
```

**Important:** When you get a nested CRDT, you receive a **handle** that retains the CRDT ID. Mutating the handle issues host calls without deserializing the entire structure.

```typescript
// Get nested map handle (lightweight, ID retained)
const metrics = this.memberMetrics.get('alice');

if (metrics) {
  // Mutate nested CRDT (incremental host call)
  const counter = metrics.get('commits') ?? new Counter();
  counter.increment();
  metrics.set('commits', counter);
}
```

### Event System

Emit events for real-time updates:

```typescript
import { Event, emit, emitWithHandler } from '@calimero-network/calimero-sdk-js';

// Define event
@Event
export class ItemAdded {
  constructor(public key: string, public value: string) {}
}

@Logic(MyApp)
export class MyAppLogic extends MyApp {
  addItem(key: string, value: string): void {
    this.items.set(key, value);
    
    // Emit event without handler
    emit(new ItemAdded(key, value));
    
    // Or emit with handler (handler executes on receiving nodes)
    emitWithHandler(new ItemAdded(key, value), 'onItemAdded');
  }

  // Event handler (runs on peer nodes, not author node)
  onItemAdded(event: ItemAdded): void {
    this.itemCount.increment();
    env.log(`Item added: ${event.key} = ${event.value}`);
  }
}
```

**Event lifecycle:**

1. Emitted during method execution
2. Included in delta broadcast to all peers
3. Handlers execute on peer nodes (not author node)
4. Handlers can update state or trigger side effects

**Handler requirements:**

- **Commutative**: Order-independent operations
- **Independent**: No shared mutable state between handlers
- **Idempotent**: Safe to retry
- **Pure**: No external side effects (only state updates)

### Private Storage

For node-local data (secrets, caches, per-node counters):

```typescript
import { createPrivateEntry } from '@calimero-network/calimero-sdk-js';

// Create private entry
const secrets = createPrivateEntry<{ token: string }>('private:secrets');

// Get or initialize
const current = secrets.getOrInit(() => ({ token: '' }));

// Modify (never synced across nodes)
secrets.modify(
  (value) => {
    value.token = 'rotated-token';
  },
  () => ({ token: '' }) // Initial value if not exists
);
```

**Key properties:**

- Never replicated across nodes
- Stored via `storage_read` / `storage_write` directly
- Never included in CRDT deltas
- Only accessible on the executing node

## Examples

The `calimero-sdk-js` repository includes comprehensive examples:

| Example | Demonstrates | Location |
| --- | --- | --- |
| **counter** | Basic Counter CRDT | `examples/counter` |
| **kv-store** | UnorderedMap + LwwRegister, events | `examples/kv-store` |
| **team-metrics** | Nested CRDTs, mergeable structs | `examples/team-metrics` |
| **private-data** | Private storage patterns | `examples/private-data` |
| **blobs** | Blob management | `examples/blobs` |
| **xcall** | Cross-context calls | `examples/xcall` |

**Run an example:**
```bash
# Clone repository
$: git clone https://github.com/calimero-network/calimero-sdk-js
> ...
> Cloning into 'calimero-sdk-js'...
> ...
> Resolving deltas: 100% (2299/2299), done.
$: cd calimero-sdk-js
# Build the sdk and cli packages
$: cd packages/sdk && pnpm build && cd ../cli && pnpm build && ../..
> > @calimero-network/calimero-sdk-js@0.0.0 build /Users/X/Desktop/calimero-sdk-js/packages/sdk
> tsc

> @calimero-network/calimero-cli-js@0.0.0 build /Users/X/Desktop/calimero-sdk-js/packages/cli
> tsc

# Run example workflow
$: cd examples/counter
$: pnpm install && pnpm build:manual
> ...
> dependencies:
> + @calimero-network/calimero-sdk-js 0.0.0 <- ../../packages/sdk
> 
> devDependencies:
> + @calimero-network/calimero-cli-js 0.0.0 <- ../../packages/cli
> ...
$: cd ../..

$: merobox bootstrap run workflows/counter-js.yml --log-level=trace
> ...
> 🚀 Executing Workflow: Counter App Test
> ...
> ...
> Workflow finished sucessfully!
```

## Comparison: JavaScript SDK vs Rust SDK

| Feature | JavaScript SDK | Rust SDK |
| --- | --- | --- |
| **Language** | TypeScript/JavaScript | Rust |
| **Runtime** | QuickJS (in WASM) | Native WASM |
| **Build Size** | ~500KB (includes QuickJS) | ~100KB (optimized) |
| **Performance** | Slower (JS interpreter) | Faster (native code) |
| **Development** | Easier (familiar JS syntax) | More learning curve |
| **Type Safety** | TypeScript | Rust |
| **CRDT Collections** | Same API | Same API |

**When to use JavaScript SDK:**

- Familiar with JavaScript/TypeScript
- Faster prototyping
- Less performance-critical applications
- Want to leverage existing JS libraries (via Rollup)

**When to use Rust SDK:**

- Need maximum performance
- Already familiar with Rust
- Complex algorithms or computations
- Minimal binary size requirements

## Deep Dives

For detailed JavaScript SDK documentation:

- **Repository**: [`calimero-network/calimero-sdk-js`](https://github.com/calimero-network/calimero-sdk-js){:target="_blank"} - Full source code
- **Getting Started**: [`docs/getting-started.md`](https://github.com/calimero-network/calimero-sdk-js/blob/master/docs/getting-started.md){:target="_blank"} - Step-by-step guide
- **Architecture**: [`docs/architecture.md`](https://github.com/calimero-network/calimero-sdk-js/blob/master/docs/architecture.md){:target="_blank"} - Build pipeline and runtime
- **Collections**: [`docs/collections.md`](https://github.com/calimero-network/calimero-sdk-js/blob/master/docs/collections.md){:target="_blank"} - CRDT usage guide
- **Events**: [`docs/events.md`](https://github.com/calimero-network/calimero-sdk-js/blob/master/docs/events.md){:target="_blank"} - Event patterns and handlers
- **Troubleshooting**: [`docs/troubleshooting.md`](https://github.com/calimero-network/calimero-sdk-js/blob/master/docs/troubleshooting.md){:target="_blank"} - Common issues

## Related Topics

- [SDK Guide (Rust)](sdk-guide.md) - Building with Rust SDK
- [Applications](../core-concepts/applications.md) - Application architecture overview
- [Core Apps Examples](../examples/core-apps-examples.md) - Rust SDK examples
- [Getting Started](../getting-started/index.md) - Complete getting started guide

