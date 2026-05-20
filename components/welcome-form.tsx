"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, User } from "lucide-react"
import GoogleButton from "@/components/google-button"

interface UserData {
  name: string
  church: string
}

interface WelcomeFormProps {
  onSubmit: (data: UserData) => void
}

// Nuvem estruturada com múltiplos círculos sobrepostos
function Cloud({
  className,
  style,
  opacity = 1,
  scale = 1,
}: {
  className?: string
  style?: React.CSSProperties
  opacity?: number
  scale?: number
}) {
  return (
    <div className={`absolute pointer-events-none ${className ?? ""}`} style={{ opacity, transform: `scale(${scale})`, ...style }}>
      <div className="relative">
        {/* Base longa */}
        <div className="absolute bottom-0 left-0 w-48 h-14 bg-white rounded-full" />
        {/* Cúpula esquerda */}
        <div className="absolute bottom-8 left-6 w-20 h-20 bg-white rounded-full" />
        {/* Cúpula central (maior) */}
        <div className="absolute bottom-10 left-16 w-28 h-28 bg-white rounded-full" />
        {/* Cúpula direita */}
        <div className="absolute bottom-7 left-28 w-22 h-18 bg-white rounded-full" />
        {/* Topo menor */}
        <div className="absolute bottom-16 left-24 w-16 h-16 bg-white rounded-full" />
      </div>
    </div>
  )
}

// Nuvem menor para camadas mais distantes
function SmallCloud({
  className,
  style,
  opacity = 1,
}: {
  className?: string
  style?: React.CSSProperties
  opacity?: number
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

export function WelcomeForm({ onSubmit }: WelcomeFormProps) {
  const [name, setName] = useState("")
  const [church, setChurch] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && church.trim()) {
      onSubmit({ name: name.trim(), church: church.trim() })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 gap-8">

      {/* ── Céu com gradiente celestial ─────────────────────────── */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-600 via-sky-300 via-60% to-amber-50" />

      {/* ── Raios de luz (god rays) ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "30%", rotate: "-18deg", delay: "0s",    width: "180px" },
          { left: "42%", rotate: "-8deg",  delay: "1.5s",  width: "220px" },
          { left: "50%", rotate: "0deg",   delay: "0.5s",  width: "260px" },
          { left: "58%", rotate: "8deg",   delay: "2s",    width: "200px" },
          { left: "68%", rotate: "16deg",  delay: "1s",    width: "160px" },
        ].map((ray, i) => (
          <div
            key={i}
            className="ray-animate absolute top-0 origin-top"
            style={{
              left: ray.left,
              width: ray.width,
              height: "70vh",
              transform: `rotate(${ray.rotate})`,
              background: "linear-gradient(to bottom, rgba(255,255,200,0.6) 0%, transparent 100%)",
              animationDelay: ray.delay,
            }}
          />
        ))}
      </div>

      {/* ── Estrelas/partículas no topo ──────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        {[
          { top: "8%",  left: "15%", size: 3, delay: "0s"   },
          { top: "12%", left: "72%", size: 4, delay: "0.8s" },
          { top: "6%",  left: "48%", size: 2, delay: "1.6s" },
          { top: "18%", left: "88%", size: 3, delay: "0.4s" },
          { top: "4%",  left: "32%", size: 2, delay: "2.1s" },
          { top: "22%", left: "6%",  size: 3, delay: "1.2s" },
          { top: "9%",  left: "93%", size: 2, delay: "0.6s" },
        ].map((star, i) => (
          <div
            key={i}
            className="star-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* ── Camada de nuvens traseiras (menores, mais lentas) ────── */}
      <div className="fixed inset-0 pointer-events-none">
        <SmallCloud className="cloud-drift-slow" opacity={0.45} style={{ top: "8%",  left: "-5%" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "15%", left: "60%",  animationDelay: "4s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.30} style={{ top: "28%", left: "80%",  animationDelay: "8s" }} />
        <SmallCloud className="cloud-drift-left"  opacity={0.40} style={{ top: "40%", left: "20%",  animationDelay: "2s" }} />
        <SmallCloud className="cloud-drift-slow"  opacity={0.25} style={{ top: "55%", left: "-8%",  animationDelay: "6s" }} />
        <SmallCloud className="cloud-drift-right" opacity={0.35} style={{ top: "65%", left: "70%",  animationDelay: "10s" }} />
      </div>

      {/* ── Camada de nuvens frontais (maiores, mais visíveis) ────── */}
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

      {/* ── Card de onboarding ───────────────────────────────────── */}
      <div className="card-float relative z-10 w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-xl border-white/60 shadow-2xl rounded-3xl overflow-hidden">

          {/* Faixa superior decorativa */}
          <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

          <CardHeader className="text-center space-y-5 pt-8 pb-4 px-8">
            {/* Logo oficial */}
            <div className="mx-auto w-24 h-24 rounded-2xl shadow-xl border-2 border-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo192.png" alt="Bíblia Sagrada" className="w-full h-full object-cover" />
            </div>

            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                Bem-vindo(a)!
              </CardTitle>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-sky-500">
                Bíblia Sagrada
              </p>
            </div>

            <CardDescription className="text-gray-500 text-sm leading-relaxed italic border-l-2 border-yellow-400 pl-3 text-left">
              "A tua palavra é lâmpada para os meus pés e luz para o meu caminho."
              <span className="block mt-1 not-italic font-medium text-yellow-600">— Salmos 119:105</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-500" />
                  Seu nome
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Como você se chama?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-base bg-white border-gray-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="church" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Church className="w-3.5 h-3.5 text-sky-500" />
                  Sua igreja
                </Label>
                <Input
                  id="church"
                  type="text"
                  placeholder="Nome da sua igreja"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  required
                  className="h-12 text-base bg-white border-gray-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={!name.trim() || !church.trim()}
                className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl mt-2"
              >
                ✨ Começar Jornada Espiritual
              </Button>
            </form>
          </CardContent>

          {/* Faixa inferior decorativa */}
          <div className="h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300" />
        </Card>
      </div>

      <GoogleButton />
    </div>
  )
}
