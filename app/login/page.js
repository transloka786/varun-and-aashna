"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (r.ok) window.location.href = "/";
    else setErr("Nope. That code is not the one. Try again ✨");
  }

  return (
    <>
      <div className="noise" />
      <div className="loginWrap">
        <motion.div
          className="loginCard"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="kicker">
            <b /> Varun × Aashna
          </div>
          <div className="h2" style={{ marginTop: 0 }}>Password protected</div>
          <p className="p">
            This page is meant for exactly one person. If you’re her, you already know the code.
          </p>

          <div style={{ height: 14 }} />

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              placeholder="Enter the secret code"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btnYes" type="submit">
              Unlock 💖
            </button>
          </form>

          {err ? <div className="err">{err}</div> : null}

          <div className="smallNote">
            Tip: Set <b>SITE_PASSWORD</b> on Vercel to match your secret code.
          </div>
        </motion.div>
      </div>
    </>
  );
}
