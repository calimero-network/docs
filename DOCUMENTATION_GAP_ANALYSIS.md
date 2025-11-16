# Documentation Gap Analysis

## Summary Comparison

### ✅ Already Well Covered
1. **Four-layer architecture** - Covered in `intro/index.md` and `core-concepts/architecture.md`
2. **Transaction flow** - Detailed sequence diagram in `architecture.md`
3. **Dual sync strategy** - Explained in `architecture.md` and `nodes.md`
4. **DAG causal ordering** - Visualized in `architecture.md`
5. **Node types** - Coordinator/peer explained in `nodes.md`
6. **Performance characteristics** - Listed in `intro/index.md`
7. **Component map** - Table in `architecture.md`
8. **Applications overview** - Comprehensive in `applications.md`
9. **CRDT collections** - Detailed in `applications.md`
10. **Where to start** - Table in `intro/index.md`

### ❌ Missing or Incomplete

#### Critical Gaps (Stub Pages)
1. **`core-concepts/contexts.md`** - Currently just a stub with TODOs
2. **`core-concepts/identity.md`** - Stub with TODOs
3. **`core-concepts/index.md`** - Placeholder content
4. **`getting-started/index.md`** - Placeholder content

#### Missing Information
1. **Use Cases** - No mention of collaborative editing, decentralized social, P2P gaming, IoT, supply chain, healthcare
2. **Detailed Component Breakdown** - Runtime, SDK, storage, DAG explanations could be more detailed with "what it does" and "why it matters"
3. **Project Structure** - The detailed `core/` directory structure with explanations of what each crate does
4. **What Makes It Unique** - The bullet points exist but could be more prominent and detailed
5. **Core Principles** - Mentioned but not emphasized enough
6. **Key Components Deep Dive** - Each major crate needs a "what/why/how" explanation

#### Structural Issues
1. **Intro page** - Good but could better emphasize unique value props
2. **Architecture page** - Component map is good but could add "responsibility" column
3. **No "Core Repository Overview"** - Missing a dedicated page explaining the core repo structure

## Proposed Improvements

### 1. Enhance `intro/index.md`
- Add prominent "Use Cases" section
- Expand "What Makes Calimero Unique" with more detail
- Add "Core Repository Structure" subsection
- Make "Core Principles" more prominent

### 2. Fill `core-concepts/contexts.md`
- Explain context isolation model
- Describe lifecycle (create, invite, join, revoke)
- Add diagram showing shared state vs private storage
- Link to merobox workflows

### 3. Fill `core-concepts/identity.md`
- Explain root vs client keys
- Describe wallet adapters
- Cover authentication flows per chain
- Link to contracts repo

### 4. Enhance `core-concepts/architecture.md`
- Add "Key Components Deep Dive" section with detailed explanations
- Expand component map with "Responsibility" column
- Add "Project Structure" section explaining core/ directory

### 5. Create `core-concepts/core-repository.md` (NEW)
- Detailed breakdown of core/ directory structure
- Explanation of each major crate (what/why/how)
- Component relationships diagram
- Links to individual crate READMEs

### 6. Fill `core-concepts/index.md`
- Replace placeholder with actual overview
- Brief summaries of each concept
- Navigation guidance

### 7. Fill `getting-started/index.md`
- Replace placeholder with actual content
- Clear progression path
- Links to each getting started page

