"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Church } from "lucide-react"

interface UserData {
  name: string
  church: string
}

interface WelcomeFormProps {
  onSubmit: (data: UserData) => void
}

export function WelcomeForm({ onSubmit }: WelcomeFormProps) {
  const [name, setName] = useState("")
  const [church, setChurch] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && church.trim()) {
      onSubmit({ name: name.trim(), church: church.trim() })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Bem-vindo(a)!</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Para começar a receber versículos bíblicos diários, precisamos conhecer você melhor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Seu nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="church" className="text-sm font-medium flex items-center gap-2">
                <Church className="w-4 h-4" />
                Sua igreja
              </Label>
              <Input
                id="church"
                type="text"
                placeholder="Nome da sua igreja"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!name.trim() || !church.trim()}
            >
              Começar Jornada Espiritual
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
