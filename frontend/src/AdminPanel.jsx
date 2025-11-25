import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setStatus("No token found. Please login.");
      return;
    }

    axios.get("http://localhost:4000/api/messages", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessages(res.data))
    .catch(err => {
      console.error(err);
      setStatus(err?.response?.data?.error || "Fetch failed");
    });
  }, []);

  return (
    <div style={{padding:40, background:"#eef1f4", minHeight:"100vh"}}>
      <div style={{maxWidth:1100, margin:"auto", background:"#fff", padding:28, borderRadius:10, boxShadow:"0 8px 28px rgba(0,0,0,0.08)"}}>
        <h2>Messages Dashboard</h2>
        {status && <p>{status}</p>}
        <table style={{width:"100%", borderCollapse:"collapse", marginTop:12}}>
          <thead>
            <tr style={{background:"#f5f7fa"}}>
              <th style={th}>ID</th><th style={th}>Name</th><th style={th}>Email</th><th style={th}>Subject</th><th style={th}>Message</th><th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(m => (
              <tr key={m.id} style={{borderBottom:"1px solid #eee"}}>
                <td style={td}>{m.id}</td>
                <td style={td}>{m.name}</td>
                <td style={td}>{m.email}</td>
                <td style={td}>{m.subject}</td>
                <td style={td}>{m.message}</td>
                <td style={td}>{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { textAlign:"left", padding:10, fontSize:13 };
const td = { padding:10, fontSize:13, verticalAlign:"top" };
