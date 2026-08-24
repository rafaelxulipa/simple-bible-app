"use client"

import { useEffect, useState } from "react"
import { Bell, Plus, Save, Check, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  MAX_NOTIFICATION_TIMES,
  type NotificationSettings,
  type NotificationTime,
} from "@/lib/notifications"

interface NotificationSettingsModalProps {
  open: boolean
  onClose: () => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

const pad = (n: number) => String(n).padStart(2, "0")

const timesEqual = (a: NotificationTime[], b: NotificationTime[]) =>
  a.length === b.length && a.every((t, i) => t.hour === b[i].hour && t.minute === b[i].minute)

export function NotificationSettingsModal({ open, onClose }: NotificationSettingsModalProps) {
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [draftTimes, setDraftTimes] = useState<NotificationTime[]>([])
  const [justSaved, setJustSaved] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    if (open) {
      const s = getNotificationSettings()
      setSettings(s)
      setDraftTimes(s.times)
      setJustSaved(false)
      setPermissionDenied(getNotificationPermission() === "denied")
    }
  }, [open])

  const toggleEnabled = async (enabled: boolean) => {
    if (!settings) return

    if (enabled) {
      const granted = await requestNotificationPermission()
      if (!granted) {
        setPermissionDenied(getNotificationPermission() === "denied")
        return
      }
    }

    const next = { ...settings, enabled }
    setSettings(next)
    saveNotificationSettings(next)
  }

  const updateDraftTime = (index: number, patch: Partial<NotificationTime>) => {
    setDraftTimes((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)))
    setJustSaved(false)
  }

  const addDraftTime = () => {
    if (draftTimes.length >= MAX_NOTIFICATION_TIMES) return
    setDraftTimes((prev) => [...prev, { hour: 12, minute: 0 }])
    setJustSaved(false)
  }

  const removeDraftTime = (index: number) => {
    if (draftTimes.length <= 1) return
    setDraftTimes((prev) => prev.filter((_, i) => i !== index))
    setJustSaved(false)
  }

  const isDirty = settings ? !timesEqual(settings.times, draftTimes) : false

  const saveTimes = () => {
    if (!settings) return
    const next = { ...settings, times: draftTimes }
    setSettings(next)
    saveNotificationSettings(next)
    setJustSaved(true)
  }

  const formattedTimes = draftTimes.map((t) => `${pad(t.hour)}:${pad(t.minute)}`).join(", ")

  if (!isNotificationSupported()) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Este navegador não tem suporte a notificações.
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </DialogTitle>
        </DialogHeader>

        {settings && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-2xl border bg-muted/40 p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold">Receber versículo aleatório</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uma notificação com um versículo sorteado a cada horário, enquanto o app estiver aberto.
                </p>
              </div>
              <Switch checked={settings.enabled} onCheckedChange={toggleEnabled} />
            </div>

            {permissionDenied && (
              <p className="text-xs text-red-500">
                As notificações estão bloqueadas para este site. Habilite a permissão nas configurações do navegador para ativar.
              </p>
            )}

            {settings.enabled && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Horários ({draftTimes.length}/{MAX_NOTIFICATION_TIMES})
                </p>

                {draftTimes.map((time, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Hora</label>
                      <Select
                        value={String(time.hour)}
                        onValueChange={(v) => updateDraftTime(index, { hour: Number(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {HOURS.map((h) => (
                            <SelectItem key={h} value={String(h)}>
                              {pad(h)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Minuto</label>
                      <Select
                        value={String(time.minute)}
                        onValueChange={(v) => updateDraftTime(index, { minute: Number(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {MINUTES.map((m) => (
                            <SelectItem key={m} value={String(m)}>
                              {pad(m)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={draftTimes.length <= 1}
                      onClick={() => removeDraftTime(index)}
                      title="Remover horário"
                    >
                      <Trash2 className={`w-4 h-4 ${draftTimes.length <= 1 ? "text-muted-foreground/40" : "text-red-500"}`} />
                    </Button>
                  </div>
                ))}

                {draftTimes.length < MAX_NOTIFICATION_TIMES && (
                  <Button variant="outline" className="w-full gap-2 border-dashed" onClick={addDraftTime}>
                    <Plus className="w-4 h-4" />
                    Adicionar horário
                  </Button>
                )}

                <Button className="w-full gap-2" disabled={!isDirty} onClick={saveTimes}>
                  {justSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {justSaved ? "Horários salvos" : "Salvar horários"}
                </Button>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              {settings.enabled
                ? `Você vai receber um versículo aleatório às ${formattedTimes} todos os dias, enquanto o app estiver aberto no navegador.`
                : "As notificações estão desativadas. Ative para escolher os horários."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
