import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [status, setStatus] = useState("");
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const change = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setStatus("Registering...");
        try {
            const res = await axios.post("http://localhost:4000/api/register", form);
            setStatus(res.data.message || "Registered successfully");
            setTimeout(() => setRedirectToLogin(true), 1400);
        } catch (err) {
            const msg = err?.response?.data?.error || "Registration failed.";
            setStatus(msg);
        }
    };

    if (redirectToLogin) return <Login />;

    return (
        <div style={box}>
            <h2 style={{ marginBottom: 12 }}>Register</h2>
            <form onSubmit={submit}>
                <input name="name" value={form.name} placeholder="Full name" onChange={change} style={input} required />
                <input name="email" value={form.email} placeholder="Email" onChange={change} style={input} required />
                <input name="password" value={form.password} placeholder="Password" onChange={change} type="password" style={input} required />
                <select name="role" value={form.role} onChange={change} style={input}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button style={button} type="submit">Register</button>
                <p style={{ marginTop: 10 }}>{status}</p>
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
const input = { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: 6, border: "1px solid #ddd" };
const button = { width: "100%", padding: "12px", background: "#2a7bd8", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
