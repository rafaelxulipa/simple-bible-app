"use client"

import Link from "next/link"
import { Shield, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.rafaelxulipa.simplebibleappmobile"

export function AppFooter() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="relative z-10 w-full pb-6 px-4">
      <div className="max-w-sm mx-auto space-y-3">

        {/* Google Play */}
        <a
          href={PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-3 w-full backdrop-blur-sm
            rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
            ${isDark
              ? "bg-gray-900 hover:bg-black border border-gray-700 hover:border-gray-500"
              : "bg-black/80 hover:bg-black border border-white/10 hover:border-white/20"}`}
        >
          {/* Ícone Google Play */}
          <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.18 1.07C2.76 1.29 2.5 1.74 2.5 2.28v19.44c0 .54.26.99.68 1.21l.1.06 10.89-10.89v-.26L3.28 1.01l-.1.06z" fill="url(#g1)"/>
            <path d="M17.6 15.54l-3.63-3.63v-.27l3.63-3.63.08.05 4.3 2.44c1.23.7 1.23 1.84 0 2.54l-4.3 2.44-.08.06z" fill="url(#g2)"/>
            <path d="M17.68 15.48L13.97 11.77 3.18 22.56c.4.43 1.07.48 1.82.05l12.68-7.13" fill="url(#g3)"/>
            <path d="M17.68 8.52L5 1.39C4.25.96 3.58 1 3.18 1.44l10.79 10.79 3.71-3.71z" fill="url(#g4)"/>
            <defs>
              <linearGradient id="g1" x1="12.13" y1="1.95" x2="-2.55" y2="16.63" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00A0FF"/>
                <stop offset="1" stopColor="#00E3FF"/>
              </linearGradient>
              <linearGradient id="g2" x1="23.16" y1="11.77" x2="2.1" y2="11.77" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFE000"/>
                <stop offset=".41" stopColor="#FFBD00"/>
                <stop offset=".78" stopColor="#FFA500"/>
                <stop offset="1" stopColor="#FF6B00"/>
              </linearGradient>
              <linearGradient id="g3" x1="14.97" y1="13.47" x2="-3.6" y2="32.04" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF3A44"/>
                <stop offset="1" stopColor="#C31162"/>
              </linearGradient>
              <linearGradient id="g4" x1="0.43" y1="-4.53" x2="8.93" y2="4.29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#32A071"/>
                <stop offset=".07" stopColor="#2DA771"/>
                <stop offset=".48" stopColor="#15CF74"/>
                <stop offset=".8" stopColor="#06E775"/>
                <stop offset="1" stopColor="#00F076"/>
              </linearGradient>
            </defs>
          </svg>

          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-[10px] uppercase tracking-widest leading-none">Disponível no</p>
            <p className="text-white font-semibold text-base leading-tight mt-0.5">Google Play</p>
          </div>

          <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
        </a>

        {/* Política de Privacidade */}
        <Link
          href="/privacidade"
          className={`group flex items-center justify-center gap-2 w-full backdrop-blur-sm
            rounded-xl px-4 py-2.5 transition-all duration-200
            ${isDark
              ? "bg-gray-800/90 hover:bg-gray-900 border border-gray-600 hover:border-gray-400"
              : "bg-white/80 hover:bg-white border border-stone-300 hover:border-stone-400"}`}
        >
          <Shield className={`w-3.5 h-3.5 transition-colors ${isDark ? "text-gray-300 group-hover:text-white" : "text-stone-500 group-hover:text-stone-700"}`} />
          <span className={`text-xs font-medium transition-colors ${isDark ? "text-gray-300 group-hover:text-white" : "text-stone-600 group-hover:text-stone-800"}`}>
            Política de Privacidade
          </span>
        </Link>

      </div>
    </div>
  )
}

// Compatibilidade com imports antigos
export default AppFooter
