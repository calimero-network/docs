# Introduction

The Internet was designed to be **peer-to-peer**. From its origins in **DARPA’s research on packet switching** — a response to the fragility of circuit-switched networks like telephony — the Internet’s architecture has always favored decentralization.

Protocols such as **TCP/IP** and **SMTP** embody this spirit: open, resilient, and without a central authority.  
Calimero builds upon that same idea.

## What Calimero Is (and Isn’t)

- **Calimero is not a blockchain.**  
- **Calimero is an application layer** built on top of the network — a place for collaboration, computation, and coordination between peers.  
- Where a blockchain would rely on **consensus**, Calimero uses **CRDTs (Conflict-free Replicated Data Types)** for distributed consistency without global agreement.

Calimero is the layer you reach for when you *don’t* need the guarantees (or costs) of consensus — when local autonomy and asynchronous coordination are enough.
