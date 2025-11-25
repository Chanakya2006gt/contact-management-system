import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import UserPanel from "./UserPanel";
import AdminPanel from "./AdminPanel";

function App() {
  const [loading, setLoading] = useState(true);
  const [hasUsers, setHasUsers] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/api/has-users")
      .then(res => setHasUsers(res.data.hasUsers))
      .catch(() => setHasUsers(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2 style={{textAlign:"center", marginTop:50}}>Loading...</h2>;

  // If users exist, show login first; else show register
  return hasUsers ? <Login /> : <Register />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
