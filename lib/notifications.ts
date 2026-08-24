"use client"

import { getRandomVerse } from "@/data/bible-verses"

export const MAX_NOTIFICATION_TIMES = 4

const SETTINGS_KEY = "simpleBible:notificationSettings"
const FIRED_KEY = "simpleBible:notificationFired"
const CLOSING_LINE = "Deus te ama, e sempre está ao seu lado! 🙏"

export interface NotificationTime {
  hour: number
  minute: number
}

export interface NotificationSettings {
  enabled: boolean
  times: NotificationTime[]
}

const DEFAULT_SETTINGS: NotificationSettings = { enabled: false, times: [{ hour: 8, minute: 0 }] }

export interface DailyVerseNotificationData {
  book: string
  chapter: number
  verse: number
  text: string
  version: string
}

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function getFiredMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function markFired(index: number, date: string) {
  const map = getFiredMap()
  map[index] = date
  localStorage.setItem(FIRED_KEY, JSON.stringify(map))
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported"
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  const result = await Notification.requestPermission()
  return result === "granted"
}

function formatReference(book: string, chapter: number, verse: number) {
  return `${book} ${chapter}:${verse}`
}

async function showVerseNotification(index: number, versionAbbr: string): Promise<DailyVerseNotificationData | null> {
  const verse = await getRandomVerse(versionAbbr)
  if (!verse) return null

  const data: DailyVerseNotificationData = {
    book: verse.book,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
    version: verse.version,
  }

  if (isNotificationSupported() && Notification.permission === "granted") {
    const title = `📖 ${formatReference(verse.book, verse.chapter, verse.verse)}`
    const body = `"${verse.text}"\n\n${CLOSING_LINE}`
    try {
      const reg = await navigator.serviceWorker?.getRegistration()
      if (reg) {
        await reg.showNotification(title, { body, icon: "/logo192.png", tag: `daily-verse-${index}` })
      } else {
        new Notification(title, { body, icon: "/logo192.png", tag: `daily-verse-${index}` })
      }
    } catch {
      // navegador sem suporte a showNotification — segue só com o modal in-app
    }
  }

  return data
}

/**
 * Checa se algum horário configurado já passou hoje e ainda não disparou.
 * Best-effort: só roda enquanto a aba/PWA está aberta (ou ao reabrir, cobrindo o horário perdido).
 */
export async function checkScheduledNotifications(versionAbbr: string): Promise<DailyVerseNotificationData | null> {
  const settings = getNotificationSettings()
  if (!settings.enabled || !isNotificationSupported() || Notification.permission !== "granted") return null

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const fired = getFiredMap()
  let firstData: DailyVerseNotificationData | null = null

  const slots = settings.times.slice(0, MAX_NOTIFICATION_TIMES)
  for (let index = 0; index < slots.length; index++) {
    const { hour, minute } = slots[index]
    const slot = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
    if (now.getTime() < slot.getTime() || fired[index] === today) continue

    markFired(index, today)
    const data = await showVerseNotification(index, versionAbbr)
    if (data && !firstData) firstData = data
  }

  return firstData
}
