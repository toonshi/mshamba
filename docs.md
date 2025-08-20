| File                        | Purpose                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`main.mo`**               | Entry point for the canister — sets up and exposes public/shared methods (registering land, investing in farms, etc.) |
| **`profiles.mo`**           | Manages user profiles: urban investors, farmers, landowners (roles, KYC, permissions)                                 |
| **`farms.mo`**              | Core logic for tokenized farms: creation, metadata, ownership shares, location info                                   |
| **`land.mo`**               | Listing of idle land, leasing logic, matching landowners to farmers                                                   |
| **`investments.mo`**        | Logic for handling investments into tokenized farms: buying shares, tracking yield, disbursements                     |
| **`network.mo`**            | Social coordination: mergers, supply chain linkage, co-ops between farmers                                            |
| **`token.mo`** *(optional)* | Custom token logic (if not using `ICP Ledger` or a wrapped token), e.g., `MSHB` for MshambaShares                     |
| **`storage.mo`**            | Key-value stable storage patterns (optional: can be merged with `farms.mo` or `profiles.mo`)                          |
| **`utils.mo`**              | Shared helper functions, e.g., date formatting, location parsing, validations                                         |
| **`types.mo`**              | Shared types (records, variants, options) used across modules                                                         |




What farms.mo Does
This module lets you:

| ✅ Feature          | 🧠 What it means                                       |
| ------------------ | ------------------------------------------------------ |
| `createFarm`       | A farmer launches a project to raise funding           |
| `getFarm`          | View a single farm                                     |
| `listFarms`        | View all listed farms (open/closed/etc.)               |
| `investInFarm`     | An investor puts money into a farm and receives shares |
| *(Optional later)* | Close, update, or manage farms over time               |



Summary
| Area            | Stack / Tooling                                      |
| --------------- | ---------------------------------------------------- |
| Smart contract  | Motoko                                               |
| Backend modules | `farms`, `land`, `profiles`, `tokens`, `investments` |
| Actor interface | `main.mo` (controller)                               |
| Storage         | In-memory `HashMap`                                  |
| Platform        | Internet Computer (DFINITY)                          |
| Deployment      | `dfx deploy` + Candid                                |
| Access control  | `Principal`-based `caller` checks                    |
| Token logic     | Internal ledger (no external token yet)              |
