import { useEffect, useId, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import "./ProductCatalog.css";

function ProductResults({ search, catalogQuery }) {
  const [catalog, setCatalog] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadProducts() {
      try {
        const url = search
          ? `/api/products?${new URLSearchParams({ search })}`
          : "/api/products";
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`Catalog request failed (${response.status})`);
        }

        const { products } = await response.json();

        if (!Array.isArray(products)) {
          throw new Error("Expected a products array");
        }

        if (!signal.aborted) {
          setCatalog({ status: "ready", products });
        }
      } catch {
        if (!signal.aborted) {
          setCatalog({ status: "error" });
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [search]);

  const { status, products = [] } = catalog;

  return (
    <>
      {status === "loading" && <p>Loading products…</p>}

      <p role="status">
        {status === "error" && "Could not load products."}
        {status === "ready" && products.length === 0 && (
          search ? "No matching products." : "No products available."
        )}
      </p>

      {products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.product_id}>
              <h3>{product.name}</h3>
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
                <div>
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
              </dl>
              <Link
                to={{ pathname: `/products/${product.product_id}`, search: catalogQuery }}
                aria-label={`Compare Prices for ${product.name}`}
              >
                Compare Prices
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search: catalogQuery } = useLocation();
  const searchInputId = useId();
  const searchInput = searchParams.get("search") ?? "";
  const search = searchInput.trim();

  useEffect(() => {
    document.title = "OpenGrocery | Products";
  }, []);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchParams((params) => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      return params;
    }, { replace: true });
  }

  return (
    <section className="product-catalog">
      <h2 tabIndex={-1}>Products</h2>
      <search className="product-catalog-search">
        <label htmlFor={searchInputId}>Search products</label>
        <input
          id={searchInputId}
          name="search"
          type="search"
          value={searchInput}
          onChange={handleSearchChange}
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </search>
      <ProductResults key={search} search={search} catalogQuery={catalogQuery} />
    </section>
  );
}

export default ProductCatalog;
