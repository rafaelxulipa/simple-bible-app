"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw, Settings, BookOpen, User, Church, Book, X,
  Heart, Share2, Moon, Sun, Search, ChevronLeft, ChevronRight,
  Shuffle, Calendar, Map, BookMarked,
} from "lucide-react"
import Link from "next/link"
import {
  getRandomVerse,
  getDailyVerse,
  getAvailableVersions,
  getBooksFromVersion,
  getChapterVerses,
  searchVerses,
  type BibleVerse,
  type BibleBook,
} from "@/data/bible-verses"
import { AppFooter } from "@/components/google-button"

interface UserData {
  name: string
  church: string
}

interface FavoriteVerse extends BibleVerse {
  savedAt: string
}

interface VerseDisplayProps {
  userData: UserData
  onReset: () => void
}

type Mode = "random" | "daily" | "navigate" | "search"

const FAVORITES_KEY = "simpleBible:favorites"

function loadFavorites(): FavoriteVerse[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? (JSON.parse(data) as FavoriteVerse[]) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: FavoriteVerse[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

interface ReadingProgressStored {
  version: string
  book: string
  chapter: number
  bookName: string
  verse?: number
}

export function VerseDisplay({ userData, onReset }: VerseDisplayProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("random")
  const [selectedVersion, setSelectedVersion] = useState("NVI")
  const [isLoading, setIsLoading] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [copied, setCopied] = useState(false)

  // Modo aleatório — histórico para prev/next
  const [verseHistory, setVerseHistory] = useState<BibleVerse[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Modo diário
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)

  // Modo navegar
  const [books, setBooks] = useState<BibleBook[]>([])
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [chapterVerses, setChapterVerses] = useState<BibleVerse[]>([])

  // Modo busca
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [favorites, setFavorites] = useState<FavoriteVerse[]>([])
  const [readingProgress, setReadingProgress] = useState<ReadingProgressStored | null>(null)
  const [showReaderModal, setShowReaderModal] = useState(false)

  const availableVersions = getAvailableVersions()
  const currentVerse = historyIndex >= 0 ? verseHistory[historyIndex] : null

  useEffect(() => {
    setFavorites(loadFavorites())
    try {
      const raw = localStorage.getItem("simpleBible:progress")
      if (raw) setReadingProgress(JSON.parse(raw))
    } catch { /* sem progresso */ }
    const init = async () => {
      const [verse, daily] = await Promise.all([getRandomVerse("NVI"), getDailyVerse("NVI")])
      if (verse) { setVerseHistory([verse]); setHistoryIndex(0) }
      setDailyVerse(daily)
    }
    init()
  }, [])

  useEffect(() => {
    const loadBks = async () => {
      const bks = await getBooksFromVersion(selectedVersion)
      setBooks(bks)
      if (bks.length > 0) {
        setSelectedBook(bks[0].abbrev)
        setSelectedChapter(1)
      }
    }
    loadBks()
  }, [selectedVersion])

  useEffect(() => {
    if (!selectedBook) return
    const load = async () => {
      setChapterVerses(await getChapterVerses(selectedVersion, selectedBook, selectedChapter))
    }
    load()
  }, [selectedVersion, selectedBook, selectedChapter])

  const handleNewVerse = async () => {
    setIsLoading(true)
    try {
      const verse = await getRandomVerse(selectedVersion)
      if (verse) {
        const trimmed = verseHistory.slice(0, historyIndex + 1)
        trimmed.push(verse)
        setVerseHistory(trimmed)
        setHistoryIndex(trimmed.length - 1)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrev = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1)
  }

  const handleNext = () => {
    if (historyIndex < verseHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
    } else {
      handleNewVerse()
    }
  }

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version)
    setSearchResults([])
    setHasSearched(false)
    const [verse, daily] = await Promise.all([getRandomVerse(version), getDailyVerse(version)])
    if (verse) { setVerseHistory([verse]); setHistoryIndex(0) }
    setDailyVerse(daily)
  }

  const handleShare = async (verse: BibleVerse) => {
    const url = `${window.location.origin}/verse/${verse.version.toLowerCase()}/${verse.abbrev}/${verse.chapter}/${verse.verse}`
    const text = `"${verse.text}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (${verse.version})`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Bíblia Sagrada", text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // usuário cancelou o share — sem ação necessária
    }
  }

  const handleToggleFavorite = (verse: BibleVerse) => {
    const isFav = favorites.some(
      (f) => f.book === verse.book && f.chapter === verse.chapter && f.verse === verse.verse && f.version === verse.version
    )
    const updated = isFav
      ? favorites.filter(
          (f) => !(f.book === verse.book && f.chapter === verse.chapter && f.verse === verse.verse && f.version === verse.version)
        )
      : [...favorites, { ...verse, savedAt: new Date().toISOString() }]
    setFavorites(updated)
    saveFavorites(updated)
  }

  const isFavorite = (verse: BibleVerse | null) => {
    if (!verse) return false
    return favorites.some(
      (f) => f.book === verse.book && f.chapter === verse.chapter && f.verse === verse.verse && f.version === verse.version
    )
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setHasSearched(true)
    const results = await searchVerses(selectedVersion, searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }

  const getCurrentTime = () =>
    new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  // Classes dinâmicas por tema
  const bg = isDark ? "from-slate-900 via-slate-800 to-slate-900" : "from-blue-400 via-blue-300 to-blue-100"
  const headerText = isDark ? "text-slate-100" : "text-white"
  const subText = isDark ? "text-slate-300" : "text-white/90"
  const panelBg = isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/10 border-white/20"
  const cardSolid = isDark ? "bg-slate-800 border-slate-700" : "bg-white/95 border-white/30"
  const labelColor = isDark ? "text-slate-100" : "text-blue-800"
  const mutedText = isDark ? "text-slate-400" : "text-gray-500"
  const bodyText = isDark ? "text-slate-200" : "text-gray-700"
  const accentText = isDark ? "text-blue-400" : "text-blue-600"
  const selectStyle = isDark
    ? "bg-slate-700 border-slate-600 text-slate-100"
    : "bg-white/20 border-white/30 text-blue-800"
  const btnGhost = isDark ? "text-slate-400 hover:bg-slate-700" : "text-gray-400 hover:bg-gray-100"
  const btnOutline = isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""

  const selectedBookData = books.find((b) => b.abbrev === selectedBook)
  const chaptersCount = selectedBookData?.chapters.length ?? 0

  // Bloco reutilizável do versículo (não é um componente para evitar remount)
  const renderVerseBlock = (verse: BibleVerse | null, showNav = false) => (
    <Card className={`${cardSolid} backdrop-blur-md shadow-2xl`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className={`flex items-center justify-center gap-2 ${labelColor} text-xl sm:text-2xl`}>
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          {mode === "daily" ? "Versículo do Dia" : "Versículo"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6 sm:p-8">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        ) : verse ? (
          <div className="text-center space-y-6">
            <blockquote
              className={`text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed italic px-4 ${bodyText}`}
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              "{verse.text}"
            </blockquote>
            <div className="space-y-1">
              <p className={`font-bold text-base sm:text-lg ${accentText}`}>
                {verse.book} {verse.chapter}:{verse.verse}
              </p>
              <p className={`text-sm ${mutedText}`}>
                {availableVersions.find((v) => v.abbreviation === verse.version)?.name}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFavorite(verse)}
                className={isFavorite(verse) ? "text-red-500 hover:text-red-600" : `${btnGhost} hover:text-red-500`}
                title="Favoritar"
              >
                <Heart className={`w-5 h-5 ${isFavorite(verse) ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(verse)}
                className={`${btnGhost} hover:text-blue-500`}
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
                {copied && <span className="ml-1 text-xs">Copiado!</span>}
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-center ${mutedText}`}>Não foi possível carregar o versículo.</p>
        )}

        {showNav && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={historyIndex <= 0}
              className={btnOutline}
              title="Versículo anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleNewVerse}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 font-medium shadow-lg transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Novo Versículo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className={btnOutline}
              title="Próximo versículo"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderVerseRow = (v: BibleVerse, i: number, total: number) => (
    <div key={`${v.book}-${v.chapter}-${v.verse}`} className="group">
      <div className="flex items-start gap-3">
        <span className={`text-xs font-bold mt-1 min-w-[20px] ${accentText}`}>{v.verse}</span>
        <p
          className={`text-sm sm:text-base leading-relaxed flex-1 ${bodyText}`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {v.text}
        </p>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggleFavorite(v)} title="Favoritar">
            <Heart className={`w-3 h-3 ${isFavorite(v) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleShare(v)} title="Compartilhar">
            <Share2 className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
      </div>
      {i < total - 1 && <Separator className="mt-3 opacity-20" />}
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className={`fixed inset-0 bg-gradient-to-b ${bg}`}>
        {!isDark && (
          <>
            <div className="absolute top-10 left-10 w-32 h-16 bg-white/30 rounded-full blur-sm animate-pulse" />
            <div className="absolute top-20 right-20 w-40 h-20 bg-white/20 rounded-full blur-sm animate-pulse delay-1000" />
            <div className="absolute top-32 left-1/3 w-28 h-14 bg-white/25 rounded-full blur-sm animate-pulse delay-500" />
            <div className="absolute top-40 right-1/3 w-36 h-18 bg-white/15 rounded-full blur-sm animate-pulse delay-1500" />
          </>
        )}
      </div>

      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className={headerText}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
                Olá, {userData.name}! 🙏
              </h1>
              <p className={`${subText} capitalize text-sm sm:text-base drop-shadow-md`}>{getCurrentTime()}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFavorites(true)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 relative"
                title="Favoritos"
              >
                <Heart className="w-4 h-4" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 border-0">
                    {favorites.length > 9 ? "9+" : favorites.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                title={isDark ? "Modo claro" : "Modo escuro"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
<Button
                variant="secondary"
                size="sm"
                onClick={() => setShowUserInfo(!showUserInfo)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                title="Configurações"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* User Info (colapsível) */}
          {showUserInfo && (
            <Card className={`${panelBg} backdrop-blur-md animate-in slide-in-from-top-2 duration-300`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 text-sm ${labelColor}`}>
                      <User className="w-4 h-4" />
                      <span>Nome: {userData.name}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${labelColor}`}>
                      <Church className="w-4 h-4" />
                      <span>Igreja: {userData.church}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onReset}
                      className="text-red-600 hover:text-white bg-red-500/20 border-red-600 hover:bg-red-500/30"
                    >
                      Redefinir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserInfo(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seletor de versão */}
          <Card className={`${panelBg} backdrop-blur-md`}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`flex items-center gap-2 font-medium ${labelColor}`}>
                  <Book className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Versão da Bíblia:</span>
                </div>
                <Select value={selectedVersion} onValueChange={handleVersionChange}>
                  <SelectTrigger className={`w-full sm:w-64 ${selectStyle} font-medium`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md">
                    {availableVersions.map((v) => (
                      <SelectItem key={v.abbreviation} value={v.abbreviation}>
                        {v.name} ({v.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Botão Ler a Bíblia */}
          <button
            onClick={() => readingProgress ? setShowReaderModal(true) : router.push("/leitura")}
            className="w-full group"
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-white text-base leading-tight">Ler a Bíblia</p>
                  {readingProgress ? (
                    <p className="text-white/80 text-xs mt-0.5 truncate">
                      Continuar: {readingProgress.bookName} {readingProgress.chapter}
                      {readingProgress.verse ? `:${readingProgress.verse}` : ""}
                    </p>
                  ) : (
                    <p className="text-white/75 text-xs mt-0.5">Leitura corrida · capítulo por capítulo</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </Card>
          </button>

          {/* Modal de retomada de leitura */}
          {showReaderModal && readingProgress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowReaderModal(false)}>
              <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-800" : "bg-white"}`}
                onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-blue-700 to-sky-500 px-6 pt-5 pb-4">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Leitura</p>
                  <h2 className="text-white font-bold text-lg leading-tight">Como deseja continuar?</h2>
                </div>
                <div className="p-6 space-y-3">
                  {readingProgress.verse ? (
                    <>
                      <button
                        onClick={() => {
                          setShowReaderModal(false)
                          const p = readingProgress
                          router.push(`/leitura?book=${p.book}&chapter=${p.chapter}&verse=${p.verse}&version=${p.version}`)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors
                          ${isDark ? "border-sky-500 bg-sky-900/30 hover:bg-sky-900/50 text-white" : "border-sky-500 bg-sky-50 hover:bg-sky-100 text-sky-800"}`}>
                        <p className="font-semibold text-sm">Continuar do versículo marcado</p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {readingProgress.bookName} {readingProgress.chapter}:{readingProgress.verse}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setShowReaderModal(false)
                          const p = readingProgress
                          router.push(`/leitura?book=${p.book}&chapter=${p.chapter}&version=${p.version}`)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-colors
                          ${isDark ? "border-slate-600 hover:bg-slate-700 text-slate-300" : "border-stone-200 hover:bg-stone-50 text-stone-700"}`}>
                        <p className="font-semibold text-sm">Abrir o capítulo do início</p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {readingProgress.bookName} — Capítulo {readingProgress.chapter}
                        </p>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowReaderModal(false)
                          const p = readingProgress
                          router.push(`/leitura?book=${p.book}&chapter=${p.chapter}&version=${p.version}`)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors
                          ${isDark ? "border-sky-500 bg-sky-900/30 hover:bg-sky-900/50 text-white" : "border-sky-500 bg-sky-50 hover:bg-sky-100 text-sky-800"}`}>
                        <p className="font-semibold text-sm">Continuar do capítulo {readingProgress.chapter}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {readingProgress.bookName}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setShowReaderModal(false)
                          const p = readingProgress
                          const nextChapter = p.chapter + 1
                          router.push(`/leitura?book=${p.book}&chapter=${nextChapter}&version=${p.version}`)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-colors
                          ${isDark ? "border-slate-600 hover:bg-slate-700 text-slate-300" : "border-stone-200 hover:bg-stone-50 text-stone-700"}`}>
                        <p className="font-semibold text-sm">Já li o capítulo {readingProgress.chapter}, ir para o {readingProgress.chapter + 1}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {readingProgress.bookName}
                        </p>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { setShowReaderModal(false); router.push("/leitura") }}
                    className={`w-full text-center px-4 py-2.5 rounded-xl text-sm transition-colors
                      ${isDark ? "text-slate-500 hover:text-slate-300" : "text-stone-400 hover:text-stone-600"}`}>
                    Começar do início (Gênesis 1)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Abas de modo */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className={`w-full ${isDark ? "bg-slate-800" : "bg-white/20 backdrop-blur-sm"}`}>
              <TabsTrigger value="random" className="flex-1 gap-1 text-xs sm:text-sm">
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Aleatório</span>
                <span className="sm:hidden">Sorteio</span>
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex-1 gap-1 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Versículo do Dia</span>
                <span className="sm:hidden">Diário</span>
              </TabsTrigger>
              <TabsTrigger value="navigate" className="flex-1 gap-1 text-xs sm:text-sm">
                <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Navegar</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex-1 gap-1 text-xs sm:text-sm">
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Buscar</span>
              </TabsTrigger>
            </TabsList>

            {/* Aleatório */}
            <TabsContent value="random" className="mt-4">
              {renderVerseBlock(currentVerse, true)}
            </TabsContent>

            {/* Versículo do Dia */}
            <TabsContent value="daily" className="mt-4 space-y-3">
              {renderVerseBlock(dailyVerse)}
              <p className={`text-center text-xs ${isDark ? "text-slate-400" : "text-white/70"}`}>
                📅 Este versículo é o mesmo para todos os usuários hoje.
              </p>
            </TabsContent>

            {/* Navegar */}
            <TabsContent value="navigate" className="mt-4 space-y-4">
              <Card className={`${panelBg} backdrop-blur-md`}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${labelColor}`}>Livro</label>
                      <Select
                        value={selectedBook}
                        onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1) }}
                      >
                        <SelectTrigger className={selectStyle}>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 bg-white">
                          {books.map((b) => (
                            <SelectItem key={b.abbrev} value={b.abbrev}>
                              {b.book}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${labelColor}`}>Capítulo</label>
                      <Select
                        value={String(selectedChapter)}
                        onValueChange={(v) => setSelectedChapter(Number(v))}
                      >
                        <SelectTrigger className={selectStyle}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 bg-white">
                          {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              Capítulo {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardSolid} backdrop-blur-md shadow-xl`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-base ${labelColor}`}>
                    {selectedBookData?.book} — Capítulo {selectedChapter}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                      {chapterVerses.map((v, i) => renderVerseRow(v, i, chapterVerses.length))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Buscar */}
            <TabsContent value="search" className="mt-4 space-y-4">
              <Card className={`${panelBg} backdrop-blur-md`}>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar palavra ou frase..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className={
                        isDark
                          ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                          : "bg-white/80 border-white/50"
                      }
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSearching ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {hasSearched && !isSearching && (
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-white/70"}`}>
                      {searchResults.length === 0
                        ? "Nenhum resultado encontrado."
                        : `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""}${searchResults.length === 50 ? " (primeiros 50)" : ""}`}
                    </p>
                  )}
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card className={`${cardSolid} backdrop-blur-md shadow-xl`}>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-96">
                      <div className="space-y-4 pr-4">
                        {searchResults.map((v, i) => (
                          <div key={`${v.book}-${v.chapter}-${v.verse}`} className="group">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-1">
                                <p
                                  className={`text-sm leading-relaxed ${bodyText}`}
                                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                                >
                                  {v.text}
                                </p>
                                <p className={`text-xs font-medium ${accentText}`}>
                                  {v.book} {v.chapter}:{v.verse}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggleFavorite(v)}>
                                  <Heart className={`w-3 h-3 ${isFavorite(v) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleShare(v)}>
                                  <Share2 className="w-3 h-3 text-gray-400" />
                                </Button>
                              </div>
                            </div>
                            {i < searchResults.length - 1 && <Separator className="mt-3 opacity-20" />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Rodapé */}
          <div className={`text-center space-y-2 pb-4 ${isDark ? "text-slate-300" : "text-blue-800/90"}`}>
            <p className="text-base sm:text-lg font-medium drop-shadow-md">
              Que a palavra de Deus ilumine seu dia! ✨
            </p>
            <p className="text-sm drop-shadow-md">Igreja: {userData.church}</p>
          </div>
        </div>
      </div>

      {/* Sheet de Favoritos */}
      <Sheet open={showFavorites} onOpenChange={setShowFavorites}>
        <SheetContent className={isDark ? "bg-slate-900 border-slate-700 text-slate-100" : ""}>
          <SheetHeader>
            <SheetTitle className={`flex items-center gap-2 ${isDark ? "text-slate-100" : ""}`}>
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              Favoritos ({favorites.length})
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] mt-4">
            {favorites.length === 0 ? (
              <div className={`text-center mt-12 ${mutedText}`}>
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum favorito ainda.</p>
                <p className="text-sm mt-1">Toque em ❤️ para salvar um versículo.</p>
              </div>
            ) : (
              <div className="space-y-3 pr-2">
                {favorites.map((v, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    <p
                      className={`text-sm leading-relaxed italic mb-3 ${bodyText}`}
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      "{v.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-bold ${accentText}`}>
                          {v.book} {v.chapter}:{v.verse}
                        </p>
                        <p className={`text-xs ${mutedText}`}>{v.version}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleShare(v)}
                          title="Compartilhar"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                          onClick={() => handleToggleFavorite(v)}
                          title="Remover favorito"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AppFooter />
    </div>
  )
}
