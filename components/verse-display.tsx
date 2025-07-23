"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Settings, BookOpen, User, Church, Book, X } from "lucide-react"
import { getRandomVerse, getAvailableVersions, type BibleVerse } from "@/data/bible-verses"

interface UserData {
  name: string
  church: string
}

interface VerseDisplayProps {
  userData: UserData
  onReset: () => void
}

export function VerseDisplay({ userData, onReset }: VerseDisplayProps) {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null)
  const [selectedVersion, setSelectedVersion] = useState("NVI")
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const availableVersions = getAvailableVersions()

  const handleNewVerse = async () => {
    setIsLoading(true)
    try {
      const verse = getRandomVerse(selectedVersion)
      setCurrentVerse(verse)
    } catch (error) {
      console.error("Erro ao carregar versículo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version)
    setIsLoading(true)
    try {
      const verse = getRandomVerse(version)
      setCurrentVerse(verse)
    } catch (error) {
      console.error("Erro ao trocar versão:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialVerse = async () => {
      setIsLoading(true)
      try {
        const verse = getRandomVerse(selectedVersion)
        setCurrentVerse(verse)
      } catch (error) {
        console.error("Erro ao carregar versículo inicial:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialVerse()
  }, [])

  const getCurrentTime = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatReference = (verse: BibleVerse) => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">Olá, {userData.name}! 🙏</h1>
              <p className="text-white/90 capitalize text-sm sm:text-base drop-shadow-md">{getCurrentTime()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowUserInfo(!showUserInfo)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-blue-800 hover:bg-white/30 transition-all duration-300"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* User Info Card (collapsible) */}
          {showUserInfo && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-blue-800 animate-in slide-in-from-top-2 duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>Nome: {userData.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Church className="w-4 h-4" />
                      <span>Igreja: {userData.church}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onReset}
                      className="text-red-600 hover:text-white bg-red-500/20 border-red-600 hover:bg-red-500/30"
                    >
                      Redefinir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserInfo(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Version Selector */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 text-blue-800 font-medium">
                  <Book className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Versão da Bíblia:</span>
                </div>
                <Select value={selectedVersion} onValueChange={handleVersionChange} disabled={isLoading}>
                  <SelectTrigger className="w-full sm:w-64 bg-white/20 border-white/30 text-blue-800 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md">
                    {availableVersions.map((version) => (
                      <SelectItem key={version.abbreviation} value={version.abbreviation}>
                        {version.name} ({version.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Main Verse Card */}
          <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-blue-800 text-xl sm:text-2xl">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                Versículo do Momento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 sm:p-8">
              {isLoading ? (
                <div className="text-center space-y-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">Carregando versículo...</p>
                </div>
              ) : currentVerse ? (
                <div className="text-center space-y-6">
                  <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 leading-relaxed italic px-4">
                    "{currentVerse.text}"
                  </blockquote>
                  <div className="space-y-2">
                    <p className="text-blue-600 font-bold text-base sm:text-lg">{formatReference(currentVerse)}</p>
                    <p className="text-sm text-gray-500">
                      Versão: {availableVersions.find((v) => v.abbreviation === selectedVersion)?.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Não foi possível carregar o versículo. Tente novamente.</p>
                </div>
              )}

              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleNewVerse}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Carregando..." : "Novo Versículo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-blue-800/90 space-y-2 pb-8">
            <p className="text-base sm:text-lg font-medium drop-shadow-md">Que a palavra de Deus ilumine seu dia! ✨</p>
            <p className="text-sm drop-shadow-md">Igreja: {userData.church}</p>
          </div>
        </div>
      </div>

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
