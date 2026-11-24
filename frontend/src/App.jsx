import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import AppRoutes from "./AppRoutes.jsx";
import "./App.css";

function App() {
  const [dbStatus, setDbStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDatabaseStatus() {
      try {
        const response = await fetch("/api/health/db");

        if (!response.ok) {
          throw new Error("Database health check failed");
        }

        const data = await response.json();
        setDbStatus(data.status);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchDatabaseStatus();
  }, []);

  return (
    <main>
      <h1>OpenGrocery</h1>
      <nav aria-label="Main" className="app-nav">
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/lists">Shopping lists</NavLink>
      </nav>
      <p>
        {error !== null
          ? error
          : dbStatus === null
            ? "Checking database..."
            : `Database status: ${dbStatus}`}
      </p>
      <AppRoutes />
    </main>
  );
}

export default App;
