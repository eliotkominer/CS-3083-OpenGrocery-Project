import { useEffect, useId, useState } from "react";
import { Link, useParams } from "react-router";
import formatQuantity from "./formatQuantity.js";
import "./ShoppingLists.css";

function ItemTable({ items }) {
  const captionId = useId();

  return (
    <div className="list-table-scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
      <table>
        <caption id={captionId}>Items on this list</caption>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Brand</th>
            <th scope="col">Variant</th>
            <th scope="col">Package</th>
            <th scope="col">Quantity</th>
            <th scope="col">Prices</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product_id}>
              <th scope="row">{item.name}</th>
              <td>{item.brand ?? "Unavailable"}</td>
              <td>{item.variant ?? "Unavailable"}</td>
              <td>{formatQuantity(item.package_size)} {item.unit}</td>
              <td>{formatQuantity(item.quantity)}</td>
              <td>
                <Link
                  to={`/products/${item.product_id}`}
                  aria-label={`Compare prices for ${item.name}`}
                >
                  Compare prices
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListResults({ listId }) {
  const [detail, setDetail] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadList() {
      try {
        const response = await fetch(`/api/lists/${encodeURIComponent(listId)}`, { signal });

        if (signal.aborted) return;
        if (response.status === 400) {
          setDetail({ status: "invalid" });
          return;
        }
        if (response.status === 404) {
          setDetail({ status: "missing" });
          return;
        }
        if (!response.ok) {
          throw new Error(`List request failed (${response.status})`);
        }

        const { list, items } = await response.json();
        if (!list || !Array.isArray(items)) {
          throw new Error("Expected a list and items array");
        }

        if (!signal.aborted) {
          setDetail({ status: "ready", list, items });
        }
      } catch {
        if (!signal.aborted) {
          setDetail({ status: "error" });
        }
      }
    }

    loadList();
    return () => controller.abort();
  }, [listId]);

  const { status, list, items = [] } = detail;
  const pageTitle = list
    ? `OpenGrocery | ${list.name} — Shopping List`
    : "OpenGrocery | Shopping List";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <>
      <h2 tabIndex={-1}>{list?.name ?? "Shopping list"}</h2>
      {list && (
        <dl>
          <div>
            <dt>Owner</dt>
            <dd>{list.owner_name}</dd>
          </div>
          <div>
            <dt>Created on</dt>
            <dd><time dateTime={list.created_at}>{list.created_at.split("T")[0]}</time></dd>
          </div>
          <div>
            <dt>Products</dt>
            <dd>{items.length}</dd>
          </div>
        </dl>
      )}

      {status === "loading" && <p>Loading shopping list…</p>}
      <p role="status">
        {status === "invalid" && "Invalid list ID."}
        {status === "missing" && "Shopping list not found."}
        {status === "error" && "Could not load the shopping list."}
        {status === "ready" && items.length === 0 && "This list has no items."}
      </p>
      {items.length > 0 && <ItemTable items={items} />}
    </>
  );
}

export default function ShoppingListDetail() {
  const { listId } = useParams();

  return (
    <section className="shopping-lists">
      <Link to="/lists">Back to shopping lists</Link>
      <ListResults key={listId} listId={listId} />
    </section>
  );
}
