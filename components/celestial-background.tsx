"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/* ── Nuvem diurna ────────────────────────────────────────────────── */
function Cloud({ className, style, opacity = 1, scale = 1 }: {
  className?: string; style?: React.CSSProperties; opacity?: number; scale?: number
}) {
  return (
    <div className={`absolute pointer-events-none ${className ?? ""}`}
      style={{ opacity, transform: `scale(${scale})`, ...style }}>
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-48 h-14 bg-white rounded-full" />
        <div className="absolute bottom-8 left-6 w-20 h-20 bg-white rounded-full" />
        <div className="absolute bottom-10 left-16 w-28 h-28 bg-white rounded-full" />
        <div className="absolute bottom-7 left-28 w-22 h-18 bg-white rounded-full" />
        <div className="absolute bottom-16 left-24 w-16 h-16 bg-white rounded-full" />
      </div>
    </div>
  )
}

function SmallCloud({ className, style, opacity = 1 }: {
  className?: string; style?: React.CSSProperties; opacity?: number
}) {
  return (
    <div className={`absolute pointer-events-none ${className ?? ""}`} style={{ opacity, ...style }}>
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-28 h-8 bg-white rounded-full" />
        <div className="absolute bottom-4 left-4 w-14 h-14 bg-white rounded-full" />
        <div className="absolute bottom-5 left-12 w-18 h-16 bg-white rounded-full" />
        <div className="absolute bottom-3 left-20 w-12 h-10 bg-white rounded-full" />
      </div>
    </div>
  )
}

/* ── Nuvem noturna ───────────────────────────────────────────────── */
function NightCloud({ style, opacity = 1 }: { style?: React.CSSProperties; opacity?: number }) {
  return (
    <div className="absolute pointer-events-none cloud-night" style={{ opacity, ...style }}>
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-56 h-12 bg-indigo-900/60 rounded-full blur-sm" />
        <div className="absolute bottom-6 left-8 w-24 h-20 bg-indigo-900/50 rounded-full blur-sm" />
        <div className="absolute bottom-8 left-20 w-32 h-24 bg-slate-800/60 rounded-full blur-sm" />
        <div className="absolute bottom-4 left-36 w-20 h-16 bg-indigo-900/50 rounded-full blur-sm" />
      </div>
    </div>
  )
}

/* ── Dados estáticos ─────────────────────────────────────────────── */

const DAY_SPARKLES = [
  { top: "8%",  left: "15%", size: 3, delay: "0s"   },
  { top: "12%", left: "72%", size: 4, delay: "0.8s" },
  { top: "6%",  left: "48%", size: 2, delay: "1.6s" },
  { top: "18%", left: "88%", size: 3, delay: "0.4s" },
  { top: "4%",  left: "32%", size: 2, delay: "2.1s" },
  { top: "22%", left: "6%",  size: 3, delay: "1.2s" },
  { top: "9%",  left: "93%", size: 2, delay: "0.6s" },
]

const NIGHT_STARS = [
  { top: "5%",  left: "8%",  size: 2, delay: "0s",    dur: "3s"   },
  { top: "10%", left: "22%", size: 1, delay: "0.5s",  dur: "4s"   },
  { top: "3%",  left: "38%", size: 3, delay: "1.2s",  dur: "3.5s" },
  { top: "7%",  left: "52%", size: 1, delay: "0.8s",  dur: "5s"   },
  { top: "13%", left: "65%", size: 2, delay: "2s",    dur: "3s"   },
  { top: "4%",  left: "78%", size: 3, delay: "0.3s",  dur: "4.5s" },
  { top: "9%",  left: "91%", size: 1, delay: "1.5s",  dur: "3.5s" },
  { top: "18%", left: "12%", size: 2, delay: "0.7s",  dur: "4s"   },
  { top: "22%", left: "29%", size: 1, delay: "2.3s",  dur: "5s"   },
  { top: "16%", left: "45%", size: 2, delay: "1s",    dur: "3s"   },
  { top: "25%", left: "58%", size: 3, delay: "0.4s",  dur: "4s"   },
  { top: "20%", left: "74%", size: 1, delay: "1.8s",  dur: "3.5s" },
  { top: "28%", left: "88%", size: 2, delay: "0.9s",  dur: "4.5s" },
  { top: "33%", left: "5%",  size: 1, delay: "2.5s",  dur: "3s"   },
  { top: "30%", left: "18%", size: 3, delay: "1.1s",  dur: "5s"   },
  { top: "36%", left: "35%", size: 2, delay: "0.6s",  dur: "4s"   },
  { top: "38%", left: "50%", size: 1, delay: "1.7s",  dur: "3.5s" },
  { top: "32%", left: "63%", size: 2, delay: "2.2s",  dur: "4s"   },
  { top: "40%", left: "80%", size: 3, delay: "0.2s",  dur: "3s"   },
  { top: "45%", left: "95%", size: 1, delay: "1.4s",  dur: "4.5s" },
  { top: "42%", left: "15%", size: 2, delay: "0.8s",  dur: "5s"   },
  { top: "48%", left: "28%", size: 1, delay: "2.6s",  dur: "3.5s" },
  { top: "50%", left: "42%", size: 2, delay: "1.3s",  dur: "4s"   },
  { top: "46%", left: "57%", size: 3, delay: "0.5s",  dur: "3s"   },
  { top: "52%", left: "70%", size: 1, delay: "1.9s",  dur: "4.5s" },
  { top: "55%", left: "85%", size: 2, delay: "0.7s",  dur: "5s"   },
  { top: "2%",  left: "55%", size: 4, delay: "0s",    dur: "2.5s" },
  { top: "14%", left: "83%", size: 3, delay: "1.6s",  dur: "3.5s" },
  { top: "26%", left: "96%", size: 2, delay: "2.8s",  dur: "4s"   },
  { top: "35%", left: "72%", size: 1, delay: "0.3s",  dur: "3s"   },
]

/* ── Céu diurno ──────────────────────────────────────────────────── */
function DaySky() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-sky-600 via-sky-300 via-60% to-amber-50" />

      {/* Sol */}
      <div className="fixed pointer-events-none"
        style={{ top: "6%", left: "72%", width: 80, height: 80 }}>
        <div className="w-full h-full rounded-full bg-yellow-200"
          style={{ boxShadow: "0 0 40px 16px rgba(255,240,120,0.5), 0 0 100px 40px rgba(255,220,60,0.2)" }} />
      </div>

      {/* Brilhos */}
      <div className="fixed inset-0 pointer-events-none">
        {DAY_SPARKLES.map((s, i) => (
          <div key={i} className="star-twinkle absolute rounded-full bg-white"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }} />
        ))}
      </div>

      {/* Nuvens traseiras */}
      <div className="fixed inset-0 pointer-events-none">
        <SmallCloud className="cloud-drift-slow"  opacity={0.45} style={{ top: "8%",  left: "-5%" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "15%", left: "60%",  animationDelay: "4s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.30} style={{ top: "28%", left: "80%",  animationDelay: "8s" }} />
        <SmallCloud className="cloud-drift-left"  opacity={0.40} style={{ top: "40%", left: "20%",  animationDelay: "2s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.25} style={{ top: "55%", left: "-8%",  animationDelay: "6s" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "65%", left: "70%",  animationDelay: "10s" }} />
      </div>

      {/* Nuvens frontais */}
      <div className="fixed inset-0 pointer-events-none">
        <Cloud className="cloud-drift-left"  opacity={0.75} scale={1.0} style={{ top: "4%",  left: "-8%" }} />
        <Cloud className="cloud-drift-right" opacity={0.65} scale={0.8} style={{ top: "10%", left: "55%",  animationDelay: "3s" }} />
        <Cloud className="cloud-drift-slow"  opacity={0.80} scale={1.2} style={{ top: "18%", left: "25%",  animationDelay: "7s" }} />
        <Cloud className="cloud-drift-left"  opacity={0.55} scale={0.7} style={{ top: "30%", left: "75%",  animationDelay: "1.5s" }} />
        <Cloud className="cloud-drift-right" opacity={0.70} scale={1.1} style={{ top: "50%", left: "-12%", animationDelay: "5s" }} />
        <Cloud className="cloud-drift-slow"  opacity={0.60} scale={0.9} style={{ top: "62%", left: "60%",  animationDelay: "9s" }} />
        <Cloud className="cloud-drift-left"  opacity={0.80} scale={1.3} style={{ top: "72%", left: "15%",  animationDelay: "2.5s" }} />
        <Cloud className="cloud-drift-right" opacity={0.65} scale={0.8} style={{ top: "82%", left: "78%",  animationDelay: "4.5s" }} />
      </div>
    </>
  )
}

/* ── Céu noturno ─────────────────────────────────────────────────── */
function NightSky() {
  return (
    <>
      {/* Gradiente noturno */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#02020f] via-[#08082e] via-40% to-[#0d1540]" />

      {/* Aurora suave */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.8), transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute top-0 right-1/4 w-80 h-48 rounded-full opacity-8"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.6), transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Lua */}
      <div className="fixed pointer-events-none"
        style={{ top: "7%", right: "10%" }}>
        {/* Halo externo */}
        <div className="absolute rounded-full moon-pulse"
          style={{
            width: 120, height: 120,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255,248,180,0.18) 0%, rgba(255,248,180,0.06) 50%, transparent 70%)",
            filter: "blur(8px)",
          }} />
        {/* Corpo da lua */}
        <div className="relative rounded-full overflow-hidden"
          style={{
            width: 72, height: 72,
            background: "radial-gradient(circle at 38% 32%, #fffff0, #fefce8 30%, #fef9c3 55%, #fef08a 80%, #fde68a)",
            boxShadow: "0 0 18px 6px rgba(255,248,150,0.35), 0 0 40px 14px rgba(255,248,100,0.15)",
          }}>
          {/* Crateras */}
          <div className="absolute rounded-full" style={{ width: 12, height: 12, top: "22%", left: "58%", background: "rgba(200,190,100,0.25)" }} />
          <div className="absolute rounded-full" style={{ width: 8,  height: 8,  top: "55%", left: "25%", background: "rgba(200,190,100,0.20)" }} />
          <div className="absolute rounded-full" style={{ width: 6,  height: 6,  top: "38%", left: "72%", background: "rgba(200,190,100,0.18)" }} />
          <div className="absolute rounded-full" style={{ width: 5,  height: 5,  top: "68%", left: "50%", background: "rgba(200,190,100,0.15)" }} />
          {/* Sombra interna para dar volume */}
          <div className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle at 70% 70%, rgba(180,160,60,0.15) 0%, transparent 60%)" }} />
        </div>
      </div>

      {/* Estrelas cadentes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="shooting absolute rounded-full bg-white/80"
          style={{ width: 2, height: 2, top: "12%", right: "30%", animationDelay: "2s", animationDuration: "7s",
            boxShadow: "0 0 4px 1px rgba(255,255,255,0.6), 10px -4px 12px rgba(255,255,255,0.3), 20px -8px 16px transparent" }} />
        <div className="shooting absolute rounded-full bg-white/60"
          style={{ width: 1, height: 1, top: "8%", right: "55%", animationDelay: "11s", animationDuration: "8s" }} />
      </div>

      {/* Estrelas */}
      <div className="fixed inset-0 pointer-events-none">
        {NIGHT_STARS.map((s, i) => (
          <div key={i} className="star-night absolute rounded-full bg-white"
            style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              animationDelay: s.delay,
              animationDuration: s.dur,
              boxShadow: s.size >= 3 ? "0 0 4px 1px rgba(255,255,255,0.5)" : undefined,
            }} />
        ))}
      </div>

      {/* Nuvens noturnas */}
      <div className="fixed inset-0 pointer-events-none">
        <NightCloud opacity={0.55} style={{ top: "5%",  left: "-4%",  animationDelay: "0s"  }} />
        <NightCloud opacity={0.40} style={{ top: "14%", left: "55%",  animationDelay: "8s"  }} />
        <NightCloud opacity={0.35} style={{ top: "28%", left: "25%",  animationDelay: "15s" }} />
        <NightCloud opacity={0.45} style={{ top: "42%", left: "70%",  animationDelay: "5s"  }} />
        <NightCloud opacity={0.30} style={{ top: "60%", left: "-10%", animationDelay: "20s" }} />
      </div>
    </>
  )
}

/* ── Componente principal ────────────────────────────────────────── */
export function CelestialBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="fixed inset-0 bg-gradient-to-b from-sky-600 via-sky-300 to-amber-50" />
  }

  return theme === "dark" ? <NightSky /> : <DaySky />
}
