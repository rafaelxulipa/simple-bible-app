"use client"

import { useState, useEffect } from "react"
import { WelcomeForm } from "@/components/welcome-form"
import { VerseDisplay } from "@/components/verse-display"

interface UserData {
  name: string
  church: string
}

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)

  // Carrega informações do usuário ao montar
  useEffect(() => {
    try {
      const data = localStorage.getItem("simpleBible:user")
      if (data) {
        setUserData(JSON.parse(data) as UserData)
      }
    } catch {
      /* ignore */
    } finally {
      setMounted(true)
    }
  }, [])

  // Salva ou redefine as informações
  const handleSubmit = (data: UserData) => {
    localStorage.setItem("simpleBible:user", JSON.stringify(data))
    setUserData(data)
  }

  const handleReset = () => {
    localStorage.removeItem("simpleBible:user")
    setUserData(null)
  }

  // Evita piscar conteúdo até o hydration
  if (!mounted) return null

  return userData ? <VerseDisplay userData={userData} onReset={handleReset} /> : <WelcomeForm onSubmit={handleSubmit} />
}
