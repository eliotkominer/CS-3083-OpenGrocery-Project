import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [productCount, setProductCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductCount() {
      try {
        const response = await fetch("/api/health/db");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductCount(data.product_count);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchProductCount();
  }, []);

  return (
    <main>
      <h1>OpenGrocery</h1>
      <p>
        {error !== null
          ? error
          : productCount === null
            ? "Loading..."
            : `Products in database: ${productCount}`}
      </p>
    </main>
  );
}

export default App;
