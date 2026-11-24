import { useEffect, useId, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import "./ProductPriceComparison.css";

function PriceTable({ prices }) {
  const captionId = useId();
  const lowestPrice = prices[0].price;

  return (
    <div className="price-table-scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
      <table>
        <caption id={captionId}>Latest recorded prices</caption>
        <thead>
          <tr>
            <th scope="col">Retailer</th>
            <th scope="col">Branch</th>
            <th scope="col">Store address</th>
            <th scope="col">Price</th>
            <th scope="col">Observed on</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((observation) => (
            <tr key={observation.store_id}>
              <th scope="row">{observation.retailer_name}</th>
              <td>{observation.branch_name ?? "Unavailable"}</td>
              <td>
                {observation.street}<br />
                {observation.city}, {observation.state} {observation.zip_code}
              </td>
              <td>
                ${observation.price}
                {observation.price === lowestPrice && <strong>Lowest recorded price</strong>}
              </td>
              <td><time dateTime={observation.observed_at}>{observation.observed_at.split("T")[0]}</time></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceResults({ productId }) {
  const [comparison, setComparison] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadPrices() {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(productId)}/prices`, { signal });

        if (signal.aborted) return;
        if (response.status === 400) {
          setComparison({ status: "invalid" });
          return;
        }
        if (response.status === 404) {
          setComparison({ status: "missing" });
          return;
        }
        if (!response.ok) {
          throw new Error(`Price request failed (${response.status})`);
        }

        const { product, prices } = await response.json();
        if (!product || !Array.isArray(prices)) {
          throw new Error("Expected a product and prices array");
        }

        if (!signal.aborted) {
          setComparison({ status: "ready", product, prices });
        }
      } catch {
        if (!signal.aborted) {
          setComparison({ status: "error" });
        }
      }
    }

    loadPrices();
    return () => controller.abort();
  }, [productId]);

  const { status, product, prices = [] } = comparison;
  const pageTitle = product
    ? `OpenGrocery | ${product.name} — Price Comparison`
    : "OpenGrocery | Price Comparison";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <>
      <h2 tabIndex={-1}>{product?.name ?? "Product price comparison"}</h2>
      {product && (
        <dl>
          <div>
            <dt>Brand</dt>
            <dd>{product.brand ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>Variant</dt>
            <dd>{product.variant ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>Package</dt>
            <dd>{product.package_size} {product.unit}</dd>
          </div>
        </dl>
      )}

      {status === "loading" && <p>Loading prices…</p>}
      <p role="status">
        {status === "invalid" && "Invalid product ID."}
        {status === "missing" && "Product not found."}
        {status === "error" && "Could not load product prices."}
        {status === "ready" && prices.length === 0 && "No recorded prices."}
      </p>
      {prices.length > 0 && <PriceTable prices={prices} />}
    </>
  );
}

export default function ProductPriceComparison() {
  const { productId } = useParams();
  const { search } = useLocation();

  return (
    <section className="product-price-comparison">
      <Link to={{ pathname: "/products", search }}>Back to products</Link>
      <PriceResults key={productId} productId={productId} />
    </section>
  );
}
