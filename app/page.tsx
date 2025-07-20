"use client"

import { useState, useEffect } from "react"
import { WelcomeForm } from "@/components/welcome-form"
import { VerseDisplay } from "@/components/verse-display"

interface UserData {
  name: string
  church: string
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se já existe dados do usuário no localStorage
    const storedData = localStorage.getItem("bibleAppUserData")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }
    setIsLoading(false)
  }, [])

  const handleUserDataSubmit = (data: UserData) => {
    // Salvar no localStorage
    localStorage.setItem("bibleAppUserData", JSON.stringify(data))
    setUserData(data)
  }

  const handleReset = () => {
    localStorage.removeItem("bibleAppUserData")
    setUserData(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {!userData ? (
        <WelcomeForm onSubmit={handleUserDataSubmit} />
      ) : (
        <VerseDisplay userData={userData} onReset={handleReset} />
      )}
    </div>
  )
}
