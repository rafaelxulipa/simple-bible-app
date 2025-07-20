"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Settings, BookOpen, User, Church, Book } from "lucide-react"
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
      // Carregar um novo versículo da versão selecionada
      const verse = getRandomVerse(version)
      setCurrentVerse(verse)
    } catch (error) {
      console.error("Erro ao trocar versão:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Carregar um versículo inicial
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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Olá, {userData.name}! 🙏</h1>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{getCurrentTime()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowUserInfo(!showUserInfo)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Info Card (collapsible) */}
        {showUserInfo && (
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Nome: {userData.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Church className="w-4 h-4" />
                    <span>Igreja: {userData.church}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  Redefinir
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version Selector */}
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Versão da Bíblia:</span>
              </div>
              <Select value={selectedVersion} onValueChange={handleVersionChange} disabled={isLoading}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
        <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400">
              <BookOpen className="w-6 h-6" />
              Versículo do Momento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Carregando versículo...</p>
              </div>
            ) : currentVerse ? (
              <div className="text-center space-y-4">
                <blockquote className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{currentVerse.text}"
                </blockquote>
                <div className="space-y-1">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">{formatReference(currentVerse)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Versão: {availableVersions.find((v) => v.abbreviation === selectedVersion)?.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Não foi possível carregar o versículo. Tente novamente.</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleNewVerse}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Carregando..." : "Novo Versículo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Que a palavra de Deus ilumine seu dia! ✨</p>
          <p className="mt-1">Igreja: {userData.church}</p>
        </div>
      </div>
    </div>
  )
}
