"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Settings, BookOpen, User, Church } from "lucide-react"
import { bibleVerses } from "@/data/bible-verses"

interface UserData {
  name: string
  church: string
}

interface VerseDisplayProps {
  userData: UserData
  onReset: () => void
}

interface Verse {
  text: string
  reference: string
  book: string
}

export function VerseDisplay({ userData, onReset }: VerseDisplayProps) {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(false)

  const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length)
    return bibleVerses[randomIndex]
  }

  const handleNewVerse = () => {
    setCurrentVerse(getRandomVerse())
  }

  useEffect(() => {
    // Carregar um versículo inicial
    setCurrentVerse(getRandomVerse())
  }, [])

  const getCurrentTime = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

        {/* Main Verse Card */}
        <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400">
              <BookOpen className="w-6 h-6" />
              Versículo do Momento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentVerse && (
              <div className="text-center space-y-4">
                <blockquote className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{currentVerse.text}"
                </blockquote>
                <div className="space-y-1">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">{currentVerse.reference}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Livro de {currentVerse.book}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button onClick={handleNewVerse} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Novo Versículo
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
