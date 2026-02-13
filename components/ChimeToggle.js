"use client";

import { useRef, useState } from "react";

export default function ChimeToggle({ label = "Chime", className = "" }) {
  const [enabled, setEnabled] = useState(true);
  const ctxRef = useRef(null);

  function getCtx() {
    if (ctxRef.current) return ctxRef.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctxRef.current = new Ctx();
    return ctxRef.current;
  }

  function tone(at, freq, dur, type = "square", gain = 0.075) {
    const ctx = getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;

    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);

    const t0 = ctx.currentTime + at;
    o.start(t0);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    o.stop(t0 + dur + 0.03);
  }

  function play() {
    if (!enabled) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const seq = [
      { f: 1046.5, d: 0.10 },
      { f: 1318.5, d: 0.10 },
      { f: 1568.0, d: 0.10 },
      { f: 2093.0, d: 0.14 },
    ];

    let at = 0;
    for (const s of seq) {
      tone(at, s.f, s.d, "square", 0.06);
      at += 0.11;
    }
    tone(at + 0.02, 2637.0, 0.06, "triangle", 0.03);
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }} className={className}>
      <button className="chip" onClick={() => setEnabled(!enabled)} type="button">
        {label}: {enabled ? "ON" : "OFF"}
      </button>
      <button className="chip" onClick={play} type="button">
        ▶ Play
      </button>
    </div>
  );
}
