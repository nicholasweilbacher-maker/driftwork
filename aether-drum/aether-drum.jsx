import { useState, useRef, useCallback, useEffect } from "react";

const SCALES = [
  { name: "Celtic", notes: [
    { n: "D", f: 146.83, h: 30 }, { n: "A", f: 220, h: 270 }, { n: "C", f: 261.63, h: 180 },
    { n: "D4", f: 293.66, h: 35 }, { n: "E", f: 329.63, h: 120 }, { n: "F", f: 349.23, h: 320 },
    { n: "G", f: 392, h: 60 }, { n: "A4", f: 440, h: 275 }, { n: "C5", f: 523.25, h: 185 }
  ]},
  { name: "Akebono", notes: [
    { n: "D", f: 146.83, h: 0 }, { n: "Eb", f: 155.56, h: 300 }, { n: "G", f: 196, h: 60 },
    { n: "A", f: 220, h: 200 }, { n: "Bb", f: 233.08, h: 140 }, { n: "D4", f: 293.66, h: 5 },
    { n: "Eb4", f: 311.13, h: 305 }, { n: "G4", f: 392, h: 65 }, { n: "A4", f: 440, h: 205 }
  ]},
  { name: "Hijaz", notes: [
    { n: "D", f: 146.83, h: 15 }, { n: "Eb", f: 155.56, h: 280 }, { n: "F#", f: 185, h: 45 },
    { n: "G", f: 196, h: 160 }, { n: "A", f: 220, h: 340 }, { n: "Bb", f: 233.08, h: 90 },
    { n: "C", f: 261.63, h: 220 }, { n: "D4", f: 293.66, h: 20 }, { n: "Eb4", f: 311.13, h: 285 }
  ]},
  { name: "Pygmy", notes: [
    { n: "D", f: 146.83, h: 25 }, { n: "Eb", f: 155.56, h: 190 }, { n: "G", f: 196, h: 55 },
    { n: "A", f: 220, h: 310 }, { n: "Bb", f: 233.08, h: 130 }, { n: "D4", f: 293.66, h: 30 },
    { n: "Eb4", f: 311.13, h: 195 }, { n: "G4", f: 392, h: 60 }, { n: "Bb4", f: 466.16, h: 135 }
  ]}
];

export default function AetherDrum() {
  const [started, setStarted] = useState(false);
  const [scaleIdx, setScaleIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [bgHue, setBgHue] = useState(220);
  const [pulseRings, setPulseRings] = useState([]);
  const acRef = useRef(null);
  const masterRef = useRef(null);

  const notes = SCALES[scaleIdx].notes;

  const initAudio = useCallback(() => {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      acRef.current = ac;
      const master = ac.createGain();
      master.gain.value = 0.55;

      const reverb = ac.createConvolver();
      const len = ac.sampleRate * 2 | 0;
      const buf = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.exp(-(i / ac.sampleRate) * 2.4) * 0.35;
        }
      }
      reverb.buffer = buf;
      const rg = ac.createGain();
      rg.gain.value = 0.25;

      const dly = ac.createDelay(1);
      dly.delayTime.value = 0.38;
      const fb = ac.createGain();
      fb.gain.value = 0.2;
      const dlf = ac.createBiquadFilter();
      dlf.type = "lowpass";
      dlf.frequency.value = 1600;
      const dlg = ac.createGain();
      dlg.gain.value = 0.15;

      master.connect(ac.destination);
      master.connect(reverb);
      reverb.connect(rg);
      rg.connect(ac.destination);
      master.connect(dly);
      dly.connect(dlf);
      dlf.connect(fb);
      fb.connect(dly);
      dlf.connect(dlg);
      dlg.connect(ac.destination);

      masterRef.current = master;
    } catch (e) {
      console.error(e);
    }
  }, []);

  const playNote = useCallback((freq, vel) => {
    const ac = acRef.current;
    const master = masterRef.current;
    if (!ac || !master) return;
    if (ac.state === "suspended") ac.resume();
    const t = ac.currentTime;
    const parts = [
      [1, 0.4, 1.5],
      [2, 0.14, 0.8],
      [2.76, 0.05, 0.5],
      [0.5, 0.07, 1.4],
    ];
    parts.forEach(([ratio, gain, decay]) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * ratio * 1.001, t);
      osc.frequency.exponentialRampToValueAtTime(freq * ratio, t + 0.05);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(gain * vel, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay * 1.6);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + decay * 2);
    });
  }, []);

  const hitPad = useCallback((i) => {
    const note = SCALES[scaleIdx].notes[i];
    if (!note) return;
    playNote(note.f, 0.7 + Math.random() * 0.3);
    setActiveIdx(i);
    setBgHue(note.h);
    const ringId = Date.now() + Math.random();
    setPulseRings(prev => [...prev.slice(-4), { id: ringId, h: note.h, i }]);
    setTimeout(() => setActiveIdx(-1), 200);
    setTimeout(() => setPulseRings(prev => prev.filter(r => r.id !== ringId)), 1200);
  }, [scaleIdx, playNote]);

  useEffect(() => {
    const keys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
    const handler = (e) => {
      if (!started) return;
      const idx = keys.indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx < 9) hitPad(idx);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, hitPad]);

  if (!started) {
    return (
      <div
        onClick={() => { initAudio(); setStarted(true); }}
        style={{
          width: "100vw", height: "100vh",
          background: "radial-gradient(ellipse at center, #0c0520, #000)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontFamily: "Georgia, serif",
          position: "fixed", inset: 0,
        }}
      >
        <svg viewBox="0 0 200 200" style={{ width: 120, height: 120, marginBottom: 24, opacity: 0.2 }}>
          <g stroke="#dbb06a" fill="none" strokeWidth="0.5">
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="55" />
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="60" r="40" />
            <circle cx="100" cy="140" r="40" />
            <circle cx="65" cy="80" r="40" />
            <circle cx="135" cy="120" r="40" />
            <polygon points="100,30 160,135 40,135" />
            <polygon points="100,170 40,65 160,65" />
          </g>
        </svg>
        <div style={{ fontSize: 22, color: "#dbb06a", letterSpacing: 8, marginBottom: 6 }}>AETHER DRUM</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 4, fontStyle: "italic", marginBottom: 40 }}>A Cosmic Pan Instrument</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: 5 }}>TAP TO AWAKEN</div>
      </div>
    );
  }

  const cSize = 280;
  const centerSz = 62;
  const outerSz = 46;
  const ringR = cSize * 0.36;

  const getPos = (i) => {
    if (i === 0) return { x: cSize / 2, y: cSize / 2 };
    const a = -Math.PI / 2 + ((i - 1) / (notes.length - 1)) * Math.PI * 2;
    return { x: cSize / 2 + Math.cos(a) * ringR, y: cSize / 2 + Math.sin(a) * ringR };
  };

  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden",
      background: `radial-gradient(ellipse at center, hsla(${bgHue},35%,8%,1) 0%, #000 70%)`,
      transition: "background 0.8s ease",
      fontFamily: "Georgia, serif",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <style>{`
        @keyframes rippleOut {
          0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
        }
        @keyframes gentleSpin {
          0% { transform: translate(-50%,-50%) rotate(0deg); }
          100% { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: "center", paddingTop: 24, pointerEvents: "none", zIndex: 2 }}>
        <div style={{ fontSize: 16, color: "rgba(255,210,160,0.5)", letterSpacing: 8 }}>AETHER DRUM</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: 3, fontStyle: "italic", marginTop: 3 }}>touch the cosmos</div>
      </div>

      {/* Background sacred geometry */}
      <svg viewBox="0 0 400 400" style={{
        position: "fixed", top: "50%", left: "50%",
        width: 360, height: 360,
        animation: "gentleSpin 60s linear infinite",
        pointerEvents: "none", zIndex: 0, opacity: 0.04 + (activeIdx >= 0 ? 0.04 : 0),
        transition: "opacity 0.3s",
      }}>
        <g stroke={`hsla(${bgHue},50%,60%,0.6)`} fill="none" strokeWidth="0.5">
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="100" />
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="120" r="80" />
          <circle cx="200" cy="280" r="80" />
          <circle cx="130" cy="160" r="80" />
          <circle cx="270" cy="160" r="80" />
          <circle cx="130" cy="240" r="80" />
          <circle cx="270" cy="240" r="80" />
          <polygon points="200,40 320,250 80,250" />
          <polygon points="200,360 80,150 320,150" />
        </g>
      </svg>

      {/* Breathing rings */}
      {[160, 240, 340].map((r, i) => (
        <div key={i} style={{
          position: "fixed", top: "50%", left: "50%",
          width: r, height: r, borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          border: `1px solid hsla(${(bgHue + i * 50) % 360},40%,40%,0.06)`,
          animation: `breathe ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      {/* Pulse ripple rings on hit */}
      {pulseRings.map(ring => {
        const pos = getPos(ring.i);
        return (
          <div key={ring.id} style={{
            position: "fixed",
            left: `calc(50% - ${cSize / 2 - pos.x}px)`,
            top: `calc(50% + 30px - ${cSize / 2 - pos.y}px)`,
            width: outerSz, height: outerSz, borderRadius: "50%",
            border: `1.5px solid hsla(${ring.h},70%,55%,0.5)`,
            animation: "rippleOut 1.2s ease-out forwards",
            pointerEvents: "none", zIndex: 1,
          }} />
        );
      })}

      {/* Instrument */}
      <div style={{
        position: "relative", width: cSize, height: cSize,
        zIndex: 1, marginTop: "auto", marginBottom: "auto",
      }}>
        {notes.map((note, i) => {
          const pos = getPos(i);
          const sz = i === 0 ? centerSz : outerSz;
          const h = note.h;
          const active = activeIdx === i;
          return (
            <div
              key={`${scaleIdx}-${i}`}
              onMouseDown={(e) => { e.preventDefault(); hitPad(i); }}
              onTouchStart={(e) => { e.preventDefault(); hitPad(i); }}
              style={{
                position: "absolute",
                left: pos.x - sz / 2,
                top: pos.y - sz / 2,
                width: sz, height: sz,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 30%, hsla(${h},45%,${active ? 45 : 28}%,0.9), hsla(${h},55%,${active ? 18 : 8}%,0.95))`,
                boxShadow: active
                  ? `0 0 24px hsla(${h},80%,55%,0.55), 0 0 50px hsla(${h},70%,40%,0.25), inset 0 1px 0 rgba(255,255,255,0.12)`
                  : `0 0 10px hsla(${h},50%,35%,0.18), inset 0 1px 0 rgba(255,255,255,0.05)`,
                border: `1px solid rgba(255,255,255,${active ? 0.12 : 0.06})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transform: active ? "scale(0.88)" : "scale(1)",
                transition: "transform 0.08s, box-shadow 0.15s, background 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{
                fontSize: i === 0 ? 13 : 10,
                color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                letterSpacing: 2,
                pointerEvents: "none",
                textShadow: `0 0 8px hsla(${h},70%,60%,${active ? 0.7 : 0.2})`,
                transition: "color 0.15s",
              }}>
                {note.n}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scale button */}
      <button
        onClick={() => setScaleIdx((scaleIdx + 1) % SCALES.length)}
        style={{
          marginBottom: 24, zIndex: 2,
          fontFamily: "Georgia, serif", fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "7px 20px",
          cursor: "pointer", letterSpacing: 3, textTransform: "uppercase",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {SCALES[scaleIdx].name}
      </button>
    </div>
  );
}
