import React, { useState } from "react";
import axios from "axios";

export default function UserPanel() {
  const savedName = sessionStorage.getItem("name") || "";
  const savedEmail = sessionStorage.getItem("email") || "";

  const [form, setForm] = useState({
    name: savedName,
    email: savedEmail,
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post("http://localhost:4000/api/contact", form);
      setStatus("Message sent.");
      setForm({ ...form, subject: "", message: "" });
    } catch (err) {
      setStatus("Send failed.");
    }
  };

  return (
    <div style={{minHeight:"100vh", background:"#eef1f4", padding:40}}>
      <div style={{maxWidth:900, margin:"auto", background:"#fff", padding:36, borderRadius:10, boxShadow:"0 8px 28px rgba(0,0,0,0.08)"}}>
        <h2>Contact Us</h2>
        <form onSubmit={submit}>
          <div style={{display:"flex", gap:12, marginBottom:12}}>
            <input name="name" value={form.name} readOnly style={{flex:1, padding:12, borderRadius:6, border:"1px solid #ddd", background:"#f2f4f7"}} />
            <input name="email" value={form.email} readOnly style={{flex:1, padding:12, borderRadius:6, border:"1px solid #ddd", background:"#f2f4f7"}} />
          </div>

          <input name="subject" placeholder="Subject" value={form.subject} onChange={change} style={{width:"100%", padding:12, borderRadius:6, border:"1px solid #ddd", marginBottom:12}} />
          <textarea name="message" placeholder="Message" value={form.message} onChange={change} style={{width:"100%", padding:12, borderRadius:6, border:"1px solid #ddd", height:140}} />

          <button type="submit" style={{marginTop:12, padding:"12px 20px", background:"#2a7bd8", color:"#fff", border:"none", borderRadius:6, cursor:"pointer"}}>Send</button>
          <p style={{marginTop:10}}>{status}</p>
        </form>
      </div>
    </div>
  );
}
