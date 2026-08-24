"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export const THEME_OVERRIDE_KEY = "simpleBible:themeOverride"

export function TimeThemeInitializer() {
  const { setTheme } = useTheme()

  useEffect(() => {
    if (localStorage.getItem(THEME_OVERRIDE_KEY) === "true") return
    const hour = new Date().getHours()
    const isNight = hour >= 18 || hour < 6
    setTheme(isNight ? "dark" : "light")
  }, [setTheme])

  return null
}
