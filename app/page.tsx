"use client"

import { useState, useEffect, useCallback } from "react"
import { WelcomeForm } from "@/components/welcome-form"
import { VerseDisplay } from "@/components/verse-display"
import { SplashScreen } from "@/components/splash-screen"

interface UserData {
  name: string
  church: string
}

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    try {
      const data = localStorage.getItem("simpleBible:user")
      if (data) setUserData(JSON.parse(data) as UserData)
    } catch { /* ignore */ }
    finally { setMounted(true) }
  }, [])

  const handleSubmit = (data: UserData) => {
    localStorage.setItem("simpleBible:user", JSON.stringify(data))
    setUserData(data)
  }

  const handleReset = () => {
    localStorage.removeItem("simpleBible:user")
    setUserData(null)
  }

  const handleSplashDone = useCallback(() => setShowSplash(false), [])

  if (!mounted || showSplash) {
    return <SplashScreen onDone={handleSplashDone} />
  }

  return userData
    ? <VerseDisplay userData={userData} onReset={handleReset} />
    : <WelcomeForm onSubmit={handleSubmit} />
}
