"use client"

import { useEffect, useState } from "react"
import { CelestialBackground } from "@/components/celestial-background"

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1400)
    const doneTimer = setTimeout(onDone, 1900)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
      <CelestialBackground />

      {/* Logo + nome */}
      <div className="relative z-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo192.png" alt="Bíblia Sagrada" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">Bíblia Sagrada</h1>
          <p className="text-white/80 text-sm mt-1">A Palavra de Deus em português</p>
        </div>
      </div>

      {/* Indicador de carregamento */}
      <div className="relative z-10 absolute bottom-12 flex gap-1.5">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
