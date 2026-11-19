# OpenGrocery project context

**Baseline as of November 19, 2026.** OpenGrocery is a two-person project for Professor Ratan Dey's Introduction to Databases course at NYU Tandon. The team reports instructor approval for the grocery topic and submission of Parts 1 and 2. The repository contains the submitted SQL and Part 3 planning documents. The original diagrams are in the external course folder. Part 3 implementation, database execution, and browser testing remain to be demonstrated.

The central comparison is the cost of buying a particular list at one branch. It depends on three facts the model keeps separately: which package the shopper wants, how many they want, and the latest recorded price of that package at that branch. The demonstration uses fictional observations. The Part 1 narrative describes a live-data vision, while the available artifacts supply static sample data.

## Sources and precedence

Use later instructor announcements or explicit approvals for changes. Use the original project artifacts to describe what the team designed, the project assignment for general requirements, the syllabus for course policy and tentative scheduling, and the briefing for team plans. The project handout describes an airline system. Its application, security, and submission requirements guide the grocery project. The detailed grocery feature list still needs confirmation. See the [file inventory](file-inventory.md) for the source locations.

## Part 1 · Conceptual design

Page 1 of `database project part 1.pdf` draws six entity sets. Each has its own underlined identifier. The drawing shows no weak entity, identifying relationship, or user subtype. The role attribute distinguishes users.

| Entity set | Underlined key | Other attributes drawn |
| --- | --- | --- |
| Retailer | `retailer_id` | name |
| Store | `store_id` | branch_name, composite address (street, city, state, zip_code), composite location (latitude, longitude) |
| Product | `product_id` | name, brand, variant, package_size, unit, category |
| PriceRecord | `price_record_id` | price, observed_at |
| User | `user_id` | name, email, password_hash, role |
| ShoppingList | `list_id` | name, created_at |

The following reading follows the arrows toward the “one” side and the double lines for total participation. A single line permits partial participation.

| Relationship | Cardinality and participation in the drawing | Translation in Part 2 |
| --- | --- | --- |
| Operates | Each Store has exactly one Retailer (Store total). A Retailer may operate 0–many stores. | Required `Store.retailer_id` |
| RecordedAt | Each PriceRecord belongs to exactly one Store (PriceRecord total). A Store may have 0–many records. | Required `PriceRecord.store_id` |
| HasPrice | Each PriceRecord refers to exactly one Product (PriceRecord total). A Product may have 0–many records. | Required `PriceRecord.product_id` |
| Enters | Each PriceRecord has 0–1 entering User. A User may enter 0–many records. Both ends are partial. | Nullable `PriceRecord.user_id` |
| Creates | Each ShoppingList has exactly one User (ShoppingList total). A User may create 0–many lists. | Required `ShoppingList.user_id` |
| Contains | ShoppingList and Product are many-to-many, both partial. The relationship has one attribute, `quantity`. | `ShoppingListItem` with both foreign keys forming its primary key |

The Part 1 narrative on p. 2 says each price is entered by an administrator. The diagram allows an observation without a user, and the DDL permits any existing user or NULL as submitter. The seed uses both customers and NULL. Admin-only entry is a proposed rule for **new application writes**. Historical attribution must survive that decision.

## Part 2 · PostgreSQL baseline

The submitted SQL in [database/](../database/) is authoritative. The table is `ShoppingListItem`. The original ER relationship is `Contains`. The identifiers below follow the submitted script's spelling. PostgreSQL folds its unquoted identifiers to lowercase. The mixed-case table `"User"` is explicitly quoted.

| Table | Required columns, including keys | Nullable columns and other rules |
| --- | --- | --- |
| Retailer | `retailer_id` (PK), `name` | None nullable |
| Store | `store_id` (PK), `retailer_id` (FK), `street`, `city`, `state`, `zip_code` | `branch_name`, `latitude`, `longitude`. The composite ER attributes become individual columns. |
| Product | `product_id` (PK), `name`, `package_size`, `unit`, `category` | `brand`, `variant`. Select by product ID to preserve package identity. |
| "User" | `user_id` (PK), `name`, `email`, `password_hash`, `role` | Email is unique. Role is required text with no allowed-values check. |
| ShoppingList | `list_id` (PK), `user_id` (FK), `name`, `created_at` | None nullable. The FK establishes the owner. |
| PriceRecord | `price_record_id` (PK), `store_id` (FK), `product_id` (FK), `price`, `observed_at` | `user_id` (FK). Price is decimal and must be at least zero. Repeated observations for a store and product are valid. |
| ShoppingListItem | `list_id` (FK), `product_id` (FK), `quantity` | The PK is the pair `(list_id, product_id)`. Quantity is `DECIMAL(10,2)` and must be positive, so fractional quantities are possible. |

The six single-column primary keys are plain integers with no sequence, identity, or default in the DDL. The two timestamps also have no default. The foreign keys specify no cascading deletes. Part 3 needs an agreed concurrency-safe way to allocate IDs, a source for timestamps, and a way to delete a populated list and its items consistently. The Part 2 scripts remain the baseline. Document any small schema proposal, reason, and effect on existing test data before making a change.

### Demonstration data and independent checks

Counting the rows in `02_insert_data.sql` gives 3 retailers, 4 stores, 12 products, 4 users, 3 lists, 10 list items, and 37 price records. Walmart has stores 101 (Albany) and 104 (Brooklyn). Target 102 and ALDI 103 are in Albany. The seed includes three customers and one administrator. All four password values are `DEMO_HASH_*` placeholders. A real authentication demonstration needs separately provisioned working credentials.

The 37 observations cover 36 distinct store/product pairs. For bananas (202) at store 101, record 502 at $0.59 precedes record 512 at $0.55. Papaya (212) has zero observations. Of the 37 entries, 32 reference sample customers and 5 have a NULL submitter. There are no administrator-attributed observations in the seed.

### Two comparisons the application must preserve

**Current product price (Q04).** Partition by `store_id, product_id`, order by `observed_at DESC, price_record_id DESC`, and take row number 1. The ID breaks ties in observation time. This picks one observation for each priced pair before any cross-store aggregation. A product without an observation can still appear in the catalog.

**Whole-list price (Q09).** The SQL fixes the list at 401, joins its items to the latest store/product prices, sums `quantity × price`, rounds the sum to two decimal places, and retains a branch only when its distinct matched product count equals the full list's item count. It orders complete totals by cost, then store ID. It omits incomplete branches and produces no rows for an empty list. The planned UI needs to explain each of those cases.

| Branch | List 401 total calculated from the seed |
| --- | ---: |
| ALDI 103, Albany | $11.25 |
| Walmart 101, Albany | $12.67 |
| Target 102, Albany | $13.25 |
| Walmart 104, Brooklyn | $14.55 |

List 401 includes two units of bananas and one each of eggs, rice, and bread. List 402 exposes the missing-price case: Target 102 and ALDI 103 lack a milk observation. These coverage checks and totals were calculated independently from the insert literals using decimal arithmetic. The available Q01–Q18 file has descriptive comments but no result rows. No PostgreSQL query or application test was run during onboarding.

## Part 3 · Scope and architecture

The team's plan is a React browser client (JavaScript, HTML, CSS), an Express HTTP API on Node.js, and PostgreSQL. The API would manage prepared, parameterized SQL, transactions, authenticated sessions, server-side ownership and role checks, validation, and error responses. The client would present public, customer, and administrator views. The database scripts are historical artifacts. There is no application source, dependency manifest, or demonstrated live connection in the inspected workspace.

Prioritize product search and comparison, authentication, private list management, full-list comparison, and administrator price entry. Price history and aggregate statistics are secondary. The plan uses demonstration data and excludes retailer feeds, payments, routing, and AI features. The [use-case map](use-cases.md) describes UC01–UC14 and the limits of the existing SQL.

## Course requirements and dates

Assignment V2 pp. 2, 5, 7–8 calls for an actual database-backed browser application using the Part 2 tables. Small changes for additional features require compatible test data and scenarios. Provide usable role-specific home pages, login via POST, session creation, identity checks on protected requests, and session termination on logout. Enforce privileged actions on the backend using the database, use prepared statements where supported, handle invalid input, and safely render user-supplied text to prevent XSS.

| Milestone | Project assignment V2 | Syllabus V3 tentative schedule |
| --- | --- | --- |
| Part 1 | October 28, 2026 | October 20 |
| Part 2 | November 8, 2026 | October 29 |
| Mandatory Part 3 progress report | **November 24, 2026, 11:59 PM Eastern** | November 19 |
| Final Part 3 submission | **December 8, 2026, 11:59 PM Eastern** | December 3 |

Use the assignment dates for planning. The PDFs state the clock time and the team briefing identifies Eastern time. Later instructor announcements take precedence. The assignment places Part 3 at about half the project grade.

- Submit a team work plan identifying responsibilities. Both teammates should contribute roughly equally across aspects of the project and understand the whole system.
- Submit the mandatory progress report through Gradescope with evidence that **each teammate has written code**. The assignment mentions possible short meetings. Documentation alone does not demonstrate this milestone.
- For the final, prepare frontend and backend source, a database backup with structure and data, an inventory explaining every application file, a separate readable use-case report with the actual SQL and a brief explanation per operation, a contribution summary, and an evaluation with valid and invalid cases.
- Be ready to run the application on a host brought to the demo or via remote access. The professor will test use cases and may ask for code explanations. There is no formal presentation requirement. Check subsequent instructions for packaging, supplied test data, and demo scheduling.

The syllabus (pp. 4–6) requires substantial implementation by each student, permits adapting public code subject to the course rules, prohibits copying other students' or previous years' projects and outsourcing, and prohibits using AI systems to develop code or solutions. The team should author the assessed work and base its reports on its own evidence. The worksheets here organize preparation.

## Decisions still needed

1. Confirm the instructor's accepted grocery use cases, including how admin provisioning satisfies the default handout's two registration paths and which admin reports are expected. The handout illustrates MD5 login. Clarify the permitted password-hashing approach and how the team will provision demonstration users.
2. Verify PostgreSQL approval. It is explicitly listed for Track A in the syllabus (pp. 3–4), but assignment p. 7 asks students to check before using a DBMS outside a list that omits PostgreSQL. Topic approval alone does not settle the DBMS wording.
3. Check for grader feedback, updated hand-in instructions, or instructor-supplied test data relevant to Part 3.
4. Agree on ID allocation, list deletion, decimal quantities, and empty-list behavior. Decide how to show incomplete branches, tied cheapest totals, and unknown prices. Keep historical customer/NULL submitters while enforcing the agreed rule for future price entry.
5. Name owners and reviewers, check the course announcements, and collect evidence of each student's work before the checkpoint. Use the [work plan](work-plan.md), [progress worksheet](progress-report.md), and [evaluation plan](evaluation.md).
