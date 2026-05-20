"use client"

import { useEffect, useState } from "react"

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1400)
    const doneTimer = setTimeout(onDone, 1900)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 via-blue-400 to-blue-200 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {/* Nuvens */}
      <div className="absolute top-12 left-10 w-28 h-14 bg-white/30 rounded-full blur-sm animate-pulse" />
      <div className="absolute top-20 right-16 w-36 h-18 bg-white/20 rounded-full blur-sm animate-pulse delay-700" />

      {/* Logo + nome */}
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
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
      <div className="absolute bottom-12 flex gap-1.5">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
