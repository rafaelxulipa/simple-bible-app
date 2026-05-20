"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function TimeThemeInitializer() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const hour = new Date().getHours()
    const isNight = hour >= 18 || hour < 6
    setTheme(isNight ? "dark" : "light")
  }, [setTheme])

  return null
}
