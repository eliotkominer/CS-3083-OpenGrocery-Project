import { useEffect, useId, useState } from "react";
import { Link } from "react-router";
import formatQuantity from "./formatQuantity.js";
import "./ShoppingLists.css";

function ListTable({ lists }) {
  const captionId = useId();

  return (
    <div className="list-table-scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
      <table>
        <caption id={captionId}>Sample shopping lists</caption>
        <thead>
          <tr>
            <th scope="col">List</th>
            <th scope="col">Owner</th>
            <th scope="col">Products</th>
            <th scope="col">Total quantity</th>
            <th scope="col">Created on</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <tr key={list.list_id}>
              <th scope="row">
                <Link to={`/lists/${list.list_id}`}>{list.name}</Link>
              </th>
              <td>{list.owner_name}</td>
              <td>{list.distinct_products}</td>
              <td>{formatQuantity(list.total_quantity)}</td>
              <td>
                <time dateTime={list.created_at}>{list.created_at.split("T")[0]}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ShoppingLists() {
  const [summary, setSummary] = useState({ status: "loading" });

  useEffect(() => {
    document.title = "OpenGrocery | Shopping Lists";
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadLists() {
      try {
        const response = await fetch("/api/lists", { signal });

        if (!response.ok) {
          throw new Error(`List request failed (${response.status})`);
        }

        const { lists } = await response.json();

        if (!Array.isArray(lists)) {
          throw new Error("Expected a lists array");
        }

        if (!signal.aborted) {
          setSummary({ status: "ready", lists });
        }
      } catch {
        if (!signal.aborted) {
          setSummary({ status: "error" });
        }
      }
    }

    loadLists();
    return () => controller.abort();
  }, []);

  const { status, lists = [] } = summary;

  return (
    <section className="shopping-lists">
      <h2 tabIndex={-1}>Shopping lists</h2>
      <p className="shopping-lists-note">
        Accounts are not available yet, so these are the fictional sample lists
        from the demonstration data, shown read-only.
      </p>

      {status === "loading" && <p>Loading shopping lists…</p>}
      <p role="status">
        {status === "error" && "Could not load shopping lists."}
        {status === "ready" && lists.length === 0 && "No shopping lists available."}
      </p>
      {lists.length > 0 && <ListTable lists={lists} />}
    </section>
  );
}
