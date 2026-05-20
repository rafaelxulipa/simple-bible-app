"use client"

export function SkyBackground({ dark = false }: { dark?: boolean }) {
  const bg = dark
    ? "from-slate-900 via-slate-800 to-slate-900"
    : "from-blue-400 via-blue-300 to-blue-100"

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${bg}`}>
      {!dark && (
        <>
          <div className="absolute top-10 left-10 w-32 h-16 bg-white/30 rounded-full blur-sm animate-pulse" />
          <div className="absolute top-20 right-20 w-40 h-20 bg-white/20 rounded-full blur-sm animate-pulse delay-1000" />
          <div className="absolute top-32 left-1/3 w-28 h-14 bg-white/25 rounded-full blur-sm animate-pulse delay-500" />
          <div className="absolute top-40 right-1/3 w-36 h-18 bg-white/15 rounded-full blur-sm animate-pulse delay-1500" />
          <div className="absolute top-60 left-1/4 w-44 h-22 bg-white/20 rounded-full blur-sm animate-pulse delay-700" />
          <div className="absolute top-80 right-1/4 w-32 h-16 bg-white/25 rounded-full blur-sm animate-pulse delay-300" />
        </>
      )}
    </div>
  )
}
