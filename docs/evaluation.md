# Part 3 evaluation plan

These are proposed checks. **All application and PostgreSQL checks below are pending.** The list-401 totals and missing coverage examples are expectations derived from the seed. Preserve the original files and use a separate test database when the team begins verification.

| Case | Expected behavior to check |
| --- | --- |
| Restore the baseline | A fresh PostgreSQL database loads all seven tables and the seed. Confirm counts from the project context, run Q01–Q18, and save results with the environment and date. Independently restore the eventual final backup. |
| Historical price | For bananas at store 101, current comparison uses $0.55. History retains $0.59. With two observations at the same time, Q04 selects the larger record ID. |
| Branch and package identity | Walmart's two branches remain separate. Same-name products with different package details remain distinguishable by product ID. |
| Missing observation | Papaya is discoverable with a clear unknown-price state. A recorded zero price, permitted by the DDL, is distinct from an absent observation. |
| Full-list comparison | For list 401, ALDI 103 is cheapest at $11.25. Stores 101, 102, and 104 total $12.67, $13.25, and $14.55 respectively. Quantities affect the total. |
| Incomplete and empty lists | For list 402, show the missing milk price at stores 102 and 103 and exclude both from cheapest-complete selection. An empty list gets its own message. |
| Registration and sessions | Test working, separately prepared credentials, duplicate email, bad password, and logout. Protected requests require a valid session after login and fail after logout. |
| List ownership | Two customers can manage their own lists. Reading, editing, deleting, or comparing another owner's list is denied by the backend. Verify populated-list deletion and that failed changes preserve consistent data. |
| List quantities | Check positive decimal quantities, zero, negative input, and repeated products. Confirm one entry per list/product pair. |
| Authorized price entry | A customer cannot submit via a direct request. An admin can append a dated record. Reject invalid references and negative prices. Earlier history remains readable. |
| Input and display | Search and list names containing quotes or markup are handled as data. Verify bound SQL values, safe text rendering, and usable errors. |

For each executed check, record the date, tester, database state, steps, expected result, actual result, and evidence. Re-run failed cases after fixes and retain both observations. Use cases without a demonstrated result remain pending.
