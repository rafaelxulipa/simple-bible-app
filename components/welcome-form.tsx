"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Church } from "lucide-react"

interface UserData {
  name: string
  church: string
}

interface WelcomeFormProps {
  onSubmit: (data: UserData) => void
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Sky Background with Clouds */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100">
        {/* Animated clouds */}
        <div className="absolute top-10 left-10 w-32 h-16 bg-white/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-20 bg-white/20 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute top-32 left-1/3 w-28 h-14 bg-white/25 rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute top-40 right-1/3 w-36 h-18 bg-white/15 rounded-full blur-sm animate-pulse delay-1500"></div>
        <div className="absolute top-60 left-1/4 w-44 h-22 bg-white/20 rounded-full blur-sm animate-pulse delay-700"></div>
        <div className="absolute top-80 right-1/4 w-32 h-16 bg-white/25 rounded-full blur-sm animate-pulse delay-300"></div>
      </div>

      {/* Content */}
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border-white/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Bem-vindo(a)!</CardTitle>
          <CardDescription className="text-gray-600 text-base leading-relaxed">
            Para começar a receber versículos bíblicos diários, precisamos conhecer você melhor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Seu nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-12 text-base bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="church" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Church className="w-4 h-4" />
                Sua igreja
              </Label>
              <Input
                id="church"
                type="text"
                placeholder="Nome da sua igreja"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                required
                className="w-full h-12 text-base bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={!name.trim() || !church.trim()}
            >
              Começar Jornada Espiritual
            </Button>
          </form>
        </CardContent>
      </Card>


      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.rafaelxulipa.simplebibleappmobile"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[4rem] left-1/2 transform -translate-x-1/2 z-20"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
          alt="Disponível no Google Play"
          className="h-12"
        />
      </a>
    </div>
  )
}
