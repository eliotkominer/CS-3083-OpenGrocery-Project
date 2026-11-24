# OpenGrocery Part 3 — implementation agreement (draft)

**Team:** Alp and Eliot. **Status:** proposed for Eliot's confirmation.  
**Checkpoint:** November 24, 2026, 11:59 pm ET. **Final:** December 8, 2026, 11:59 pm ET, unless instructor announces changes.

## Shared structure

```text
project-opengrocery/
  frontend/             React + Vite, JavaScript
    src/components/     shared reusable components
    src/features/products/   Alp: catalog and prices
    src/features/lists/      Eliot: shopping lists
    src/api/            requests to Express
  backend/              Node.js + Express
    src/routes/         HTTP routes by feature
    src/db/             PostgreSQL connection and query modules
    src/middleware/     session and authorization checks
  database/             original submitted Part 2 SQL (preserve)
  docs/                 project documentation and actual demo evidence
  README.md
  .gitignore
```

Use one GitHub repository. Create applications with officially documented framework tools, rather than AI-generated assessed code. No ORM, Docker, TypeScript, or UI library required for the progress checkpoint. Each person runs their own local PostgreSQL with the submitted SQL scripts; passwords and local environment files are never committed.

## Student ownership

**Alp**: create and review a minimal shared startup foundation with Eliot; then implement product browsing and latest price comparison end-to-end (React + Express + PostgreSQL). Suggested branches: `setup/shared-foundation`, then `feature/product-comparison`.

**Eliot**: review foundation, then implement a read-only shopping-list-and-quantities flow using fictional seeded data (React + Express + PostgreSQL). Suggested branch: `feature/shopping-lists`. Student-authored authorization and list mutations should follow only after sessions exist.

**Both**: review each other's code and share backend, frontend, database and tests; integrate, validate, document actual contributions. No claimed working features without evidence.

## Tentative API agreement — not implemented

| Method and route                    | Purpose                                                 | Owner             |
| ----------------------------------- | ------------------------------------------------------- | ----------------- |
| GET /api/products                   | Browse and search catalog                               | Alp               |
| GET /api/products/:productId/prices | Current observed prices by store                        | Alp               |
| GET /api/stores                     | Branch info                                             | Alp               |
| GET /api/lists                      | Lists of authenticated customer                         | Eliot, after auth |
| GET /api/lists/:listId              | Items and quantities (authorized when real users exist) | Eliot             |
| POST /api/lists                     | Create an owned list                                    | Eliot, later      |
| GET /api/lists/:listId/compare      | Complete list cost across stores                        | Both, later       |

Before coding, agree JSON shapes and error responses. Browser never connects directly to PostgreSQL; database credentials stay with the backend.

## Database rules

Preserve exactly the seven submitted tables: `retailer`, `store`, `product`, `"User"`, `shoppinglist`, `shoppinglistitem`, `pricerecord`. `Contains` is the ER relationship, not a SQL table. Use `observed_at DESC, price_record_id DESC` to break ties in latest price observations. Compare identical packaged products at specific branches. Missing price is unknown, not zero. Count only stores with complete coverage when calculating list totals. Seed password hashes are placeholders, not valid logins. Use parameterized SQL and enforce ownership/roles on the server.

## Milestones

### Shared foundation — both students

- Agree the directory names, frontend/backend ports, and a minimal JSON interface; confirm the server's startup instructions.
- Create the React and Express app scaffolds using standard documented tools, with student-authored code.
- Ensure every person can run the app locally and connect the backend to their own development database.
- Review a foundation pull request and merge before independent feature work.

### By November 24 — mandatory progress report

- Alp: demonstrate product browsing and store-level price comparison for a seeded product.
- Eliot: demonstrate a seeded shopping list with its items and quantities.
- Both: personal application-source commits and reproducible proof of working behavior, with screenshots / commands and actual observations.
- Be transparent about any missing login, security, or mutation features. Do not present a fixed seed-user list as an authenticated workflow.

### By December 8 — final

- Add authentication, server-side permissions, list management, complete-list comparison, admin price observations, and usability/evaluation as feasible.
- Update file inventory, use case SQL report, work-plan contributions, and back up the finished database. Rehearse demo and test invalid inputs.
