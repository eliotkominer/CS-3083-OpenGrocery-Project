# Proposed grocery use cases and SQL

These are the team's proposed Part 3 workflows. Each is pending implementation and confirmation of the grocery-specific scope. The Part 2 queries are examples for design and testing. For final hand-in, record what each completed component actually executes, including writes.

| ID | Actor and planned action | Part 2 starting point and remaining work |
| --- | --- | --- |
| UC01 | Public · browse products | Q02 lists the catalog. Include variant when needed to distinguish packages. |
| UC02 | Public · search and filter | Q02 supplies catalog fields. Add parameterized search and selected filters. |
| UC03 | Public · compare one product | Q04 supplies current observations, Q05 compares bananas, Q06 identifies a cheapest branch, and Q12 finds never-priced products. Use the selected product ID and show observation times and missing coverage. |
| UC04 | Public · browse stores | Q01 joins retailers and branches, Q13 counts branches, and Q18 filters to Albany, NY. Keep store IDs visible where a retailer has multiple branches. |
| UC05 | Public · register a customer | New account insert and input validation. The unique email constraint supports duplicate handling. Agree separately on privileged account provisioning. |
| UC06 | Account holder · log in and out | Add credential lookup, hash verification, role-appropriate landing pages, session creation and destruction. Q03 lists users and roles for inspection only. |
| UC07 | Customer · view own lists | Q07 joins lists to owners and Q17 summarizes contents. Scope reads to the authenticated owner. |
| UC08 | Customer · create, rename, delete a list | Add owner-scoped writes. Resolve ID assignment and deletion of child items under the existing foreign keys. |
| UC09 | Customer · add, change, remove a list item | Q08 reads list 401. Add owner-scoped writes using the list/product key, validate decimal quantities, and define behavior when the product is already on the list. |
| UC10 | Customer · compare a selected list | Q09 returns only complete totals for 401. Bind the chosen owned list, display coverage and the cheapest complete option, and handle empty lists. |
| UC11 | Administrator · add a price observation | Add a server-authorized insert for an existing store and product. Record the submitter and observation time. Retain prior observations. |
| UC12 | Administrator · inspect price data | Q10 shows attributed observations, Q11 shows those without a submitter, and Q12 identifies gaps. Confirm required admin operations. |
| UC13 | Optional · inspect price history | Q15 lists bananas at store 101 chronologically. Accept the selected product and store. |
| UC14 | Optional · view basic statistics | Q13 counts stores per retailer, Q14 averages current prices across covered stores, and Q16 counts products per category. |

## Reading the query file

Q04, Q05, Q06, Q09, and Q14 all rank observations within a store/product pair. Q06 then ranks current store prices per product and returns one winner, breaking price ties by store ID. Q14 counts only stores with a current observation. Q10 and Q11 separate attributed and unattributed records. Q17 counts distinct list entries via their composite key and sums requested quantities, retaining empty lists through a left join.

Q05 (product 202), Q08/Q09 (list 401), Q15 (store 101/product 202), and Q18 (Albany, NY) hard-code sample inputs. Q07, Q08, Q09, and Q17 demonstrate database operations without enforcing request-level list ownership. Q01–Q18 are all reads. Registration, authentication, sessions, mutations, and authorization still require student implementation.

## Final report worksheet

For each implemented use case, record its actor, entry point, expected inputs, session/ownership checks, exact SQL with bound parameters, explanation of the rows read or written, and a reproducible success and failure case. Mark omitted or partial workflows accurately. This worksheet contains no executed application SQL.
