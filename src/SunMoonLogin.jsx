import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import "./SunMoonLogin.css";

const STARS = [
  [75, 95], [120, 68], [175, 88], [205, 135], [62, 150],
  [212, 190], [70, 215], [150, 62], [185, 215],
];

const RAYS = Array.from({ length: 12 }, (_, i) => i * 30);

export default function SunMoonLogin() {
  const [isDay, setIsDay] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const rootRef = useRef(null);
  const skyRef = useRef(null);
  const hillRef = useRef(null);
  const starsRef = useRef(null);
  const cloudsRef = useRef(null);
  const moonRef = useRef(null);
  const sunRef = useRef(null);
  const busyRef = useRef(false);
  const firstRender = useRef(true);

  // Animasi pergantian malam <-> siang
  useLayoutEffect(() => {
    const root = rootRef.current;
    root.setAttribute("data-day", isDay);

    const instant = firstRender.current;
    firstRender.current = false;

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power2.inOut" },
      onComplete: () => (busyRef.current = false),
    });
    const go = (el, vars, pos = 0) =>
      instant ? gsap.set(el, vars) : tl.to(el, vars, pos);

    go(root, { backgroundColor: isDay ? "#f3e9d2" : "#121417" });
    go(skyRef.current, { fill: isDay ? "#8fd3f4" : "#1b1d2e" });
    go(hillRef.current, { fill: isDay ? "#6fbf73" : "#2a2d44" });
    go(starsRef.current, { opacity: isDay ? 0 : 1 });
    go(cloudsRef.current, { opacity: isDay ? 1 : 0, x: isDay ? 0 : -40 });
    go(moonRef.current, { y: isDay ? 160 : 0, opacity: isDay ? 0 : 1 });
    go(sunRef.current, { y: isDay ? 0 : 160, opacity: isDay ? 1 : 0 }, isDay ? 0.15 : 0);
  }, [isDay]);

  const toggle = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setIsDay((prev) => !prev);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: sambungkan ke API login kamu di sini
    setMessage("Login berhasil ✨ (demo)");
  };

  return (
    <div className="sm-page" ref={rootRef} data-day="false">
      {/* ===== SCENE ===== */}
      <div className="scene-wrap">
        <svg viewBox="0 0 260 340" aria-hidden="false">
          <defs>
            <clipPath id="sceneClip">
              <circle cx="130" cy="170" r="120" />
            </clipPath>
          </defs>

          <g
            className="scene"
            tabIndex={0}
            role="button"
            aria-label={isDay ? "Klik untuk kembali ke malam" : "Klik untuk menyambut pagi"}
            onClick={toggle}
            onKeyDown={onKeyDown}
          >
            <g clipPath="url(#sceneClip)">
              <circle ref={skyRef} cx="130" cy="170" r="120" fill="#1b1d2e" />

              {/* bintang */}
              <g ref={starsRef}>
                {STARS.map(([x, y], i) => (
                  <circle
                    key={i}
                    className="star"
                    cx={x}
                    cy={y}
                    r={i % 3 === 0 ? 2.4 : 1.6}
                    fill="#fff"
                    style={{ animationDelay: `${(i % 5) * 0.4}s` }}
                  />
                ))}
              </g>

              {/* awan */}
              <g ref={cloudsRef} opacity="0" fill="#fff" fillOpacity="0.92">
                <ellipse cx="80" cy="112" rx="28" ry="10" />
                <circle cx="70" cy="104" r="11" />
                <circle cx="92" cy="102" r="14" />
                <ellipse cx="190" cy="150" rx="22" ry="8" />
                <circle cx="182" cy="144" r="9" />
                <circle cx="198" cy="143" r="11" />
              </g>

              {/* bulan */}
              <g ref={moonRef}>
                <circle cx="130" cy="170" r="42" fill="#eceaf5" />
                <circle cx="116" cy="158" r="8" fill="#cfd0dc" />
                <circle cx="146" cy="182" r="11" fill="#cfd0dc" />
                <circle cx="140" cy="153" r="5" fill="#cfd0dc" />
              </g>

              {/* matahari */}
              <g ref={sunRef} opacity="0">
                <circle cx="130" cy="170" r="76" fill="#ffe58a" opacity="0.35" />
                <g className="rays">
                  {RAYS.map((deg) => (
                    <line
                      key={deg}
                      x1="130" y1="102" x2="130" y2="88"
                      stroke="#ffc83a" strokeWidth="5" strokeLinecap="round"
                      transform={`rotate(${deg} 130 170)`}
                    />
                  ))}
                </g>
                <circle cx="130" cy="170" r="44" fill="#ffd54a" />
              </g>

              {/* bukit */}
              <path
                ref={hillRef}
                d="M0 255 Q70 215 130 245 T260 238 L260 300 L0 300 Z"
                fill="#2a2d44"
              />
            </g>

            <circle className="ring" cx="130" cy="170" r="120" fill="none" />
          </g>
        </svg>
        <div className="hint">
          {isDay ? "Klik untuk kembali ke malam 🌙" : "Klik bulan untuk menyambut pagi ☀️"}
        </div>
      </div>

      {/* ===== FORM LOGIN ===== */}
      <form
        className={`login-form ${isDay ? "active" : ""}`}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2>Selamat pagi</h2>
        <p>Masuk ke akunmu untuk melanjutkan.</p>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn" type="submit">Masuk</button>
        <div className="msg">{message}</div>
      </form>
    </div>
  );
}
