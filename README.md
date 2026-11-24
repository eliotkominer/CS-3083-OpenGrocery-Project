# OpenGrocery

OpenGrocery is a two-person grocery price comparison project for NYU Tandon's **CS-UY 3083, Introduction to Databases, Fall 2026**. A shopper should be able to answer two questions: “Which branch has the lowest recorded price for this product?” and “Where can I buy everything on my list for the lowest total?”

## Project status

The team submitted the ER design in Part 1 and the relational design, PostgreSQL scripts, and sample queries in Part 2. This repository holds the submitted SQL and planning documents for Part 3. The browser application is planned. The prices and stores in the seed are fictional.

## Database and planned application

The Part 2 design has seven tables. `Retailer` and `Store` distinguish a chain from a branch. `Product` describes a particular package. `PriceRecord` keeps dated observations for a product at a branch. `"User"`, `ShoppingList`, and `ShoppingListItem` connect owners to lists and products to requested quantities.

The planned stack is React with JavaScript, HTML, and CSS in the browser, an Express API on Node.js, and PostgreSQL. The proposed public interface supports product search, price comparison, and store lookup. Customers would manage their own lists and compare the cost at branches with prices for every item. Administrators would add dated observations while preserving price history.

## Where to start

| Location                                                                      | Contents                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [database/](database/)                                                        | Submitted PostgreSQL schema, demonstration data, and Q01–Q18           |
| [Project context](docs/project-context.md)                                    | ER design, SQL constraints, sample data, and course requirements       |
| [Use cases](docs/use-cases.md)                                                | Proposed features and their connections to the Part 2 queries          |
| [Work plan](docs/work-plan.md) and [progress report](docs/progress-report.md) | Team planning and evidence to collect for the November checkpoint      |
| [Evaluation](docs/evaluation.md) and [file inventory](docs/file-inventory.md) | Planned checks and an index of local documents and external references |

For a fresh PostgreSQL database, start with [the table definitions](database/01_create_tables.sql), load [the demonstration data](database/02_insert_data.sql), and then run [the example queries](database/03_queries_and_results.sql).

The team keeps course PDFs in its external course folder.
