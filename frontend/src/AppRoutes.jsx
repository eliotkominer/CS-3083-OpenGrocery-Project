import { useEffect, useRef } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router";
import ProductCatalog from "./features/products/ProductCatalog.jsx";
import ProductPriceComparison from "./features/products/ProductPriceComparison.jsx";
import ShoppingLists from "./features/lists/ShoppingLists.jsx";
import ShoppingListDetail from "./features/lists/ShoppingListDetail.jsx";

function PageNotFound() {
  useEffect(() => {
    document.title = "OpenGrocery | Page Not Found";
  }, []);

  return (
    <section>
      <h2 tabIndex={-1}>Page not found</h2>
      <Link to="/products">Back to products</Link>
    </section>
  );
}

export default function AppRoutes() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const page = useRef(null);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      page.current?.querySelector("h2")?.focus();
    }
  }, [pathname]);

  return (
    <div ref={page}>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:productId" element={<ProductPriceComparison />} />
        <Route path="/lists" element={<ShoppingLists />} />
        <Route path="/lists/:listId" element={<ShoppingListDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
