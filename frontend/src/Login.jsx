import React, { useState } from "react";
import axios from "axios";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";
import Register from "./Register";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState("");
  const [goRegister, setGoRegister] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");
    try {
      const res = await axios.post("http://localhost:4000/api/login", form);
      const { token, role, name, email } = res.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("email", email);
      setRole(role);
    } catch (err) {
      const msg = err?.response?.data?.error || "Login failed.";
      setStatus(msg);
    }
  };

  // redirect based on role
  if (role === "admin") return <AdminPanel />;
  if (role === "user") return <UserPanel />;

  // go to register page
  if (goRegister) return <Register />;

  return (
    <div style={box}>
      <h2 style={{ marginBottom: 12 }}>Login</h2>

      <form onSubmit={submit}>
        <input
          name="email"
          placeholder="Email"
          onChange={change}
          style={input}
          required
        />
        <input
          name="password"
          placeholder="Password"
          onChange={change}
          type="password"
          style={input}
          required
        />

        <button style={button} type="submit">Login</button>

        <p style={{ marginTop: 10 }}>{status}</p>

        <p style={{ marginTop: 20, textAlign: "center" }}>
          Don’t have an account?{" "}
          <span
            onClick={() => setGoRegister(true)}
            style={{ color: "#2a7bd8", cursor: "pointer", fontWeight: 600 }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

const box = {
  padding: "36px",
  maxWidth: "420px",
  margin: "80px auto",
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 6px 26px rgba(0,0,0,0.08)"
};
const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: 6,
  border: "1px solid #ddd"
};
const button = {
  width: "100%",
  padding: "12px",
  background: "#2a7bd8",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
