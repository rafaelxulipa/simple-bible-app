"use client"

import { useState } from "react"
import { Bell, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { DailyVerseNotificationData } from "@/lib/notifications"

interface DailyVerseNotificationModalProps {
  verse: DailyVerseNotificationData | null
  onClose: () => void
}

export function DailyVerseNotificationModal({ verse, onClose }: DailyVerseNotificationModalProps) {
  const [copied, setCopied] = useState(false)

  if (!verse) return null

  const reference = `${verse.book} ${verse.chapter}:${verse.verse}`

  const handleShare = async () => {
    const text = `"${verse.text}" — ${reference} (${verse.version})`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Bíblia Sagrada", text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // usuário cancelou o share — sem ação necessária
    }
  }

  return (
    <Dialog open={!!verse} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Bell className="w-5 h-5" />
            Versículo do dia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center py-2">
          <blockquote
            className="text-lg italic leading-relaxed text-gray-700 dark:text-slate-200"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            "{verse.text}"
          </blockquote>
          <div className="space-y-1">
            <p className="font-bold text-blue-600 dark:text-blue-400">{reference}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Versão: {verse.version}</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/40">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Deus te ama, e sempre está ao seu lado! 🙏
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              {copied ? "Copiado!" : "Compartilhar"}
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
