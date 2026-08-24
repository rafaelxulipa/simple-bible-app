"use client"

import { useEffect, useRef, useState } from "react"
import { checkScheduledNotifications, type DailyVerseNotificationData } from "@/lib/notifications"

const CHECK_INTERVAL_MS = 30_000

export function useDailyVerseNotifications(versionAbbr: string) {
  const [pendingVerse, setPendingVerse] = useState<DailyVerseNotificationData | null>(null)
  const versionRef = useRef(versionAbbr)
  versionRef.current = versionAbbr

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      const data = await checkScheduledNotifications(versionRef.current)
      if (data && !cancelled) setPendingVerse(data)
    }

    tick()
    const id = setInterval(tick, CHECK_INTERVAL_MS)

    const onVisible = () => {
      if (document.visibilityState === "visible") tick()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return { pendingVerse, clearPendingVerse: () => setPendingVerse(null) }
}
