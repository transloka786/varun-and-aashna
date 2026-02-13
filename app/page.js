
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import ChimeToggle from "../components/ChimeToggle";

function PixelIcon({ size = 44, className = "", variant = "heart" }) {
  const paths = {
    heart: "M10 4h4v2h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2H8V6h2V4z",
    star: "M14 2h2v6h6v2h-6v6h-2v-6H8V8h6V2z",
    sparkle:
      "M14 1h2v5h5v2h-5v5h-2v-5H9V6h5V1z M4 14h2v3h3v2H6v3H4v-3H1v-2h3v-3z",
    rose: "M9 3h6v2h2v4h-2v2h-2v2h2v2h2v4h-2v2H9v-2H7v-4h2v-2h2v-2H9V9H7V5h2V3z",
  };

  return (
    <svg
      className={`pixel ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={paths[variant]} />
    </svg>
  );
}

function FloatingBits({ mouseX, mouseY }) {
  const bits = useMemo(
    () => [
      { x: "8%", y: "14%", s: 44, v: "heart", a: 26, d: 0.0, c: "var(--rose)" },
      { x: "88%", y: "18%", s: 38, v: "star", a: 22, d: 0.2, c: "var(--orchid)" },
      { x: "72%", y: "68%", s: 40, v: "sparkle", a: 24, d: 0.35, c: "var(--mint)" },
      { x: "10%", y: "76%", s: 34, v: "sparkle", a: 20, d: 0.55, c: "var(--cream)" },
      { x: "52%", y: "12%", s: 38, v: "rose", a: 20, d: 0.75, c: "var(--rose)" },
      { x: "92%", y: "88%", s: 34, v: "heart", a: 18, d: 0.9, c: "var(--orchid)" },
    ],
    []
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {bits.map((b, idx) => {
        const px = useTransform(mouseX, [0, 1], [-b.a, b.a]);
        const py = useTransform(mouseY, [0, 1], [-b.a, b.a]);

        return (
          <motion.div
            key={idx}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              x: px,
              y: py,
              opacity: 0.9,
              color: b.c,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.95, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + b.d }}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{
                duration: 4 + idx * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ filter: "drop-shadow(0 18px 32px rgba(0,0,0,.35))" }}
            >
              <PixelIcon size={b.s} variant={b.v} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SoftQuiz({ onDone }) {
  const questions = useMemo(
    () => [
      { q: "Is Aashna the best thing that ever happened to Varun?", yes: "Yes." },
      { q: "Is she effortlessly stunning?", yes: "Yes." },
      { q: "Does she make ordinary days feel like holidays?", yes: "Yes." },
      { q: "Is Varun going to keep choosing her—every time?", yes: "Yes." },
      { q: "Final question: will she be his Valentine?", yes: "YES 💖" },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const noRef = useRef(null);

  function dodgeNo() {
    const el = noRef.current;
    if (!el) return;

    const maxX = Math.min(240, window.innerWidth * 0.32);
    const maxY = 90;

    const x = (Math.random() * 2 - 1) * maxX;
    const y = (Math.random() * 2 - 1) * maxY;

    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function yes() {
    if (idx >= questions.length - 1) {
      onDone();
      return;
    }
    setIdx(idx + 1);
    if (noRef.current) noRef.current.style.transform = "translate(0,0)";
  }

  return (
    <div className="card">
      <div className="pad" style={{ textAlign: "center" }}>
        <div className="kicker" style={{ justifyContent: "center" }}>
          <b /> Truth detector
        </div>
        <div className="h2" style={{ marginTop: 0 }}>{questions[idx].q}</div>
        <p className="p" style={{ maxWidth: 760, margin: "0 auto" }}>
          One option is emotionally incorrect. The other is correct and adorable.
        </p>

        <div className="btnRow">
          <button className="btn btnYes" onClick={yes}>
            {questions[idx].yes}
          </button>
          <button
            className="btn"
            ref={noRef}
            onPointerEnter={dodgeNo}
            onPointerDown={(e) => { e.preventDefault(); dodgeNo(); }}
            onTouchStart={(e) => { e.preventDefault(); dodgeNo(); }}
            aria-label="No (this button is shy)"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [toast, setToast] = useState(false);
  const [done, setDone] = useState(false);

  // Pointer parallax
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 120, damping: 22 });
  const smy = useSpring(my, { stiffness: 120, damping: 22 });

  // Scroll progress (client-only; avoids Next prerender + framer useScroll quirks)
  const sp = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      sp.set(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sp]);

  const heroScale = useTransform(sp, [0, 0.22], [1, 0.98]);
  const heroBlur = useTransform(sp, [0, 0.22], [0, 6]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;

  const lift1 = useTransform(sp, [0, 1], [0, -24]);
  const lift2 = useTransform(sp, [0, 1], [0, -36]);

  function setPointerNorm(clientX, clientY) {
    const nx = Math.min(1, Math.max(0, clientX / window.innerWidth));
    const ny = Math.min(1, Math.max(0, clientY / window.innerHeight));
    mx.set(nx);
    my.set(ny);
  }

  useEffect(() => {
    const onMove = (e) => setPointerNorm(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });

    const onTouch = (e) => {
      if (!e.touches?.[0]) return;
      setPointerNorm(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [mx, my]);

  const heroX = useTransform(smx, [0, 1], [-18, 18]);
  const heroY = useTransform(smy, [0, 1], [-14, 14]);

  function finish() {
    setDone(true);
    setToast(true);
    setTimeout(() => setToast(false), 3200);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  const poem = `Aashna,

Time didn’t dilute us.
It distilled us.

We learned the tiny skills that make love last:
how to return after a hard day,
how to laugh before pride speaks,
how to choose “us” even when the world is loud.

You are my calm and my spark —
the person I want beside me
in every version of the future.

So here’s my promise:
not dramatic, not temporary —
steady, intentional, and real.

I’ll keep showing up.
I’ll keep building.
I’ll keep choosing you.

Today. Tomorrow.
And all the years after.

— Varun`;

  return (
    <>
      <div className="noise" />
      <div className="wrap">
        <div className="nav">
          <div className="max">
            <div className="navRow">
              <a className="brand" href="#top">
                <span className="brandDot" />
                <span>Varun × Aashna</span>
              </a>
              <div className="links">
                <a className="chip" href="#varun">Varun</a>
                <a className="chip" href="#aashna">Aashna</a>
                <a className="chip" href="#poem">Poem</a>
                <a className="chip" href="#quiz">Valentine</a>
              </div>
            </div>
          </div>
        </div>

        <section id="top">
          <div className="max" style={{ position: "relative" }}>
            <motion.div
              className="card"
              style={{
                position: "relative",
                overflow: "hidden",
                scale: heroScale,
                filter: heroFilter,
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <FloatingBits mouseX={smx} mouseY={smy} />
              </div>

              <motion.div className="pad" style={{ position: "relative", x: heroX, y: heroY, textAlign:"center" }}>
                <div className="kicker" style={{ justifyContent:"center" }}><b /> chic pixels • clean motion</div>
                <div className="h1">A small website for a very big “yes”.</div>
                <p className="p" style={{ maxWidth: 760, margin: "0 auto" }}>
                  Scroll. Let the little 8-bit icons float. Tap around. This page is optimized for romance —
                  and it works on phones too.
                </p>

                <div style={{ display:"flex", justifyContent:"center", marginTop: 16 }}>
                  <ChimeToggle />
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                  <span className="pill">Neo-modern</span>
                  <span className="pill">8-bit accents</span>
                  <span className="pill">Smooth scroll</span>
                  <span className="pill">Password protected</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="varun">
          <div className="max">
            <div className="grid">
              <motion.div className="card" style={{ y: lift1 }}>
                <div className="photo" style={{ backgroundImage: "url(/him.jpg)" }}>
                  <div className="photoOverlay" />
                  <div className="label"><span className="pill">Player 01</span> Varun</div>
                </div>
              </motion.div>

              <motion.div className="card" style={{ y: lift2 }}>
                <div className="pad">
                  <div className="kicker"><b />steady love</div>
                  <div className="h2">The kind of love that doesn’t perform — it delivers.</div>
                  <p className="p">
                    Calm, consistent, and quietly sure. The plan isn’t “big gestures forever”.
                    It’s the daily decision that never expires.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    <span className="pill">🧠 thoughtful</span>
                    <span className="pill">🛡️ loyal</span>
                    <span className="pill">🎯 intentional</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="aashna">
          <div className="max">
            <div className="grid">
              <motion.div className="card" style={{ y: lift2 }}>
                <div className="pad">
                  <div className="kicker"><b />soft power</div>
                  <div className="h2">Aashna is the upgrade.</div>
                  <p className="p">
                    Elegant, warm, and unmistakably her. The kind of presence that makes
                    life feel more textured — like someone turned the saturation up on joy.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    <span className="pill">✨ radiant</span>
                    <span className="pill">🌿 grounding</span>
                    <span className="pill">💫 unforgettable</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="card" style={{ y: lift1 }}>
                <div className="photo" style={{ backgroundImage: "url(/her.jpg)" }}>
                  <div className="photoOverlay" />
                  <div className="label"><span className="pill">Player 02</span> Aashna</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="poem">
          <div className="max">
            <motion.div className="card" style={{ y: lift1 }}>
              <div className="pad">
                <div className="kicker"><b />declaration</div>
                <div className="h2">A poem that’s basically a contract (but romantic).</div>
                <div className="poem">{poem}</div>
              </div>
            </motion.div>

            <div style={{ height: 18 }} />

            <motion.div className="card" style={{ y: lift2 }}>
              <div className="photo" style={{ minHeight: 520, backgroundImage: "url(/together.jpg)" }}>
                <div className="photoOverlay" />
                <div className="label"><span className="pill">Us</span> The correct timeline.</div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="quiz">
          <div className="max">
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", inset:0 }}>
                <FloatingBits mouseX={smx} mouseY={smy} />
              </div>

              <div style={{ position:"relative" }}>
                {!done ? <SoftQuiz onDone={finish} /> : null}

                {done ? (
                  <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                  >
                    <div className="pad" style={{ textAlign:"center" }}>
                      <div className="kicker" style={{ justifyContent:"center" }}><b />final answer</div>
                      <div className="h1" style={{ marginBottom: 8 }}>YES 💖</div>
                      <p className="p" style={{ maxWidth: 760, margin:"0 auto" }}>
                        That’s the only correct outcome. The universe has been notified.
                      </p>
                      <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", marginTop: 16 }}>
                        <span style={{ color:"var(--rose)" }}><PixelIcon variant="heart" size={30} /></span>
                        <span style={{ color:"var(--mint)" }}><PixelIcon variant="sparkle" size={30} /></span>
                        <span style={{ color:"var(--orchid)" }}><PixelIcon variant="star" size={30} /></span>
                        <span style={{ color:"var(--cream)" }}><PixelIcon variant="rose" size={30} /></span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>

            <div style={{ height: 18 }} />

            <motion.div className="card" style={{ y: lift2 }}>
              <div className="photo" style={{ backgroundImage: "url(/together.jpg)", minHeight: 420 }}>
                <div className="photoOverlay" />
                <div className="label"><span className="pill">Unlocked</span> Future, together.</div>
              </div>
            </motion.div>

            <div style={{ height: 12 }} />
            <p className="p" style={{ textAlign:"center", opacity: 0.6 }}>
              Built for Aashna. Powered by Varun. Protected by vibes.
            </p>
          </div>
        </section>

        <div className={`toast ${toast ? "toastShow" : ""}`}>
          ✅ Correct choice locked in. ❤️
        </div>
      </div>
    </>
  );
}
