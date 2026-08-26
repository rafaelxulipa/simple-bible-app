"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, User, BookOpen } from "lucide-react"
import { AppFooter } from "@/components/google-button"
import { CelestialBackground } from "@/components/celestial-background"
import { SearchableSelect } from "@/components/searchable-select"
import { getAvailableVersions, DEFAULT_VERSION_ABBR } from "@/data/bible-verses"
import { saveSelectedVersion } from "@/lib/version-storage"

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
  const [version, setVersion] = useState(DEFAULT_VERSION_ABBR)
  const availableVersions = getAvailableVersions()
  const versionOptions = availableVersions.map((v) => ({
    value: v.abbreviation,
    label: v.name,
    sublabel: v.abbreviation,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && church.trim()) {
      saveSelectedVersion(version)
      onSubmit({ name: name.trim(), church: church.trim() })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 gap-8">
      <CelestialBackground />

      {/* Card de onboarding */}
      <div className="card-float relative z-10 w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-xl border-white/60 shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

          <CardHeader className="text-center space-y-5 pt-8 pb-4 px-8">
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
                  className="h-12 text-base text-gray-900 bg-white border-gray-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl placeholder:text-gray-400"
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
                  className="h-12 text-base text-gray-900 bg-white border-gray-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  Versão da Bíblia
                </Label>
                <SearchableSelect
                  value={version}
                  onValueChange={setVersion}
                  options={versionOptions}
                  searchPlaceholder="Buscar versão..."
                  className="h-12 text-base text-gray-900 bg-white border-gray-200 rounded-xl"
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

          <div className="h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300" />
        </Card>
      </div>

      <AppFooter />
    </div>
  )
}
