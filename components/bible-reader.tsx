"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ChevronLeft, ChevronRight, BookOpen, Settings2,
  Heart, Share2, ArrowLeft, List, Moon, Sun,
  BookMarked, Bookmark, Type, HelpCircle, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  getAvailableVersions,
  getBooksFromVersion,
  getChapterVerses,
  type BibleBook,
  type BibleVerse,
} from "@/data/bible-verses"

/* ── Constantes ─────────────────────────────────────────────────── */

const FONT_SIZES = [
  { label: "P",  value: "text-sm",   desc: "Pequena"  },
  { label: "M",  value: "text-base", desc: "Média"    },
  { label: "G",  value: "text-lg",   desc: "Grande"   },
  { label: "GG", value: "text-xl",   desc: "Enorme"   },
]

const FAVORITES_KEY = "simpleBible:favorites"
const PROGRESS_KEY  = "simpleBible:progress"
const TUTORIAL_KEY  = "simpleBible:readerTutorial"

interface FavoriteVerse extends BibleVerse { savedAt: string }

interface ReadingProgress {
  version: string
  book: string
  chapter: number
  bookName: string
  verse?: number
}

const TUTORIAL_STEPS = [
  {
    icon: <ChevronLeft className="w-8 h-8 text-sky-500" />,
    title: "Navegue pelos capítulos",
    desc: 'Use os botões "Anterior" e "Próximo" no rodapé da página para avançar ou voltar entre capítulos. Ao chegar no último capítulo do livro, o próximo livro abre automaticamente.',
  },
  {
    icon: <List className="w-8 h-8 text-sky-500" />,
    title: "Índice completo",
    desc: 'Toque no ícone de lista (☰) no canto superior direito para abrir o índice bíblico. Lá você encontra todos os 66 livros divididos entre Antigo e Novo Testamento.',
  },
  {
    icon: <Heart className="w-8 h-8 text-sky-500" />,
    title: "Favorite versículos",
    desc: "Toque em qualquer versículo para revelar os botões de ação. Clique no coração ❤️ para salvar o versículo nos seus favoritos, ou no ícone de compartilhar para enviar para alguém.",
  },
  {
    icon: <Bookmark className="w-8 h-8 text-sky-500" />,
    title: "Progresso salvo automaticamente",
    desc: "Ao sair do leitor e voltar, um banner aparece mostrando onde você parou. Clique nele para continuar exatamente do mesmo ponto. Tudo é salvo localmente no seu dispositivo.",
  },
  {
    icon: <Type className="w-8 h-8 text-sky-500" />,
    title: "Personalize a leitura",
    desc: 'Toque em ⚙ (configurações) para ajustar o tamanho do texto entre quatro tamanhos (P, M, G, GG) e para pular direto para qualquer capítulo do livro atual. Também há o botão de modo escuro 🌙.',
  },
]

/* ── Funções de storage ─────────────────────────────────────────── */

function loadFavorites(): FavoriteVerse[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]") } catch { return [] }
}
function saveFavorites(f: FavoriteVerse[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(f))
}
function loadProgress(): ReadingProgress | null {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "null") } catch { return null }
}
function saveProgress(p: ReadingProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}
function hasDoneTutorial() {
  try { return !!localStorage.getItem(TUTORIAL_KEY) } catch { return false }
}
function markTutorialDone() {
  localStorage.setItem(TUTORIAL_KEY, "1")
}

/* ── Tutorial overlay ───────────────────────────────────────────── */

function ReaderTutorial({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const [step, setStep] = useState(0)
  const isLast = step === TUTORIAL_STEPS.length - 1
  const { icon, title, desc } = TUTORIAL_STEPS[step]

  const finish = () => { markTutorialDone(); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-800" : "bg-white"}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 pt-6 pb-4 relative">
          <button onClick={finish} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
            Guia rápido · {step + 1} de {TUTORIAL_STEPS.length}
          </p>
          <h2 className="text-white font-bold text-xl leading-tight">{title}</h2>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-700" : "bg-sky-50"}`}>
            {icon}
          </div>
          <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-stone-600"}`}>
            {desc}
          </p>
        </div>

        {/* Dots + botões */}
        <div className={`px-6 pb-6 flex items-center justify-between`}>
          <div className="flex gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-5 bg-sky-500"
                  : isDark ? "w-1.5 bg-slate-600" : "w-1.5 bg-stone-200"
              }`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}
                className={isDark ? "text-slate-400" : "text-stone-400"}>
                Voltar
              </Button>
            )}
            <Button size="sm" onClick={isLast ? finish : () => setStep(s => s + 1)}
              className="bg-sky-500 hover:bg-sky-600 text-white">
              {isLast ? "Começar a ler ✨" : "Próximo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Componente principal ───────────────────────────────────────── */

interface BibleReaderProps {
  initialBook?: string
  initialChapter?: number
  initialVerse?: number
  initialVersion?: string
}

export function BibleReader({ initialBook, initialChapter, initialVerse, initialVersion }: BibleReaderProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const [version, setVersion]           = useState(initialVersion ?? "NVI")
  const [books, setBooks]               = useState<BibleBook[]>([])
  const [selectedBook, setSelectedBook] = useState(initialBook ?? "")
  const [selectedChapter, setSelectedChapter] = useState(initialChapter ?? 1)
  const [verses, setVerses]             = useState<BibleVerse[]>([])
  const [isLoading, setIsLoading]       = useState(false)
  const [fontSize, setFontSize]         = useState("text-base")
  const [showIndex, setShowIndex]       = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [favorites, setFavorites]       = useState<FavoriteVerse[]>([])
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null)
  const [copied, setCopied]             = useState(false)
  const [pageDir, setPageDir]           = useState<"next" | "prev">("next")
  const [pageKey, setPageKey]           = useState(0)
  const [savedProgress, setSavedProgress] = useState<ReadingProgress | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [initialized, setInitialized]  = useState(false)
  const [bookmarkedVerse, setBookmarkedVerse] = useState<number | null>(initialVerse ?? null)
  const topRef = useRef<HTMLDivElement>(null)
  const pendingDirRef = useRef<"next" | "prev">("next")
  const pendingScrollVerseRef = useRef<number | null>(initialVerse ?? null)

  const versions = getAvailableVersions()
  const selectedBookData = books.find((b) => b.abbrev === selectedBook)
  const chaptersCount = selectedBookData?.chapters.length ?? 0

  /* ── Inicialização ── */
  useEffect(() => {
    setFavorites(loadFavorites())
    setSavedProgress(loadProgress())
    if (!hasDoneTutorial()) setShowTutorial(true)
    setInitialized(true)
  }, [])

  /* ── Carrega livros ── */
  useEffect(() => {
    const load = async () => {
      const bks = await getBooksFromVersion(version)
      setBooks(bks)
      if (bks.length > 0 && !selectedBook) {
        setSelectedBook(bks[0].abbrev)
        setSelectedChapter(1)
      }
    }
    load()
  }, [version])

  /* ── Carrega versículos ── */
  useEffect(() => {
    if (!selectedBook) return
    const load = async () => {
      setIsLoading(true)
      const newVerses = await getChapterVerses(version, selectedBook, selectedChapter)
      setVerses(newVerses)
      setPageDir(pendingDirRef.current)
      setPageKey(k => k + 1)
      setIsLoading(false)
      const scrollVerse = pendingScrollVerseRef.current
      if (scrollVerse) {
        pendingScrollVerseRef.current = null
        setTimeout(() => {
          document.getElementById(`verse-${scrollVerse}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      } else {
        topRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }
    load()
  }, [version, selectedBook, selectedChapter])

  const bookmarkVerse = (verseNum: number) => {
    if (!selectedBookData) return
    setBookmarkedVerse(verseNum)
    saveProgress({
      version,
      book: selectedBook,
      chapter: selectedChapter,
      bookName: selectedBookData.book,
      verse: verseNum,
    })
  }

  /* ── Salva progresso automaticamente ── */
  useEffect(() => {
    if (!initialized || !selectedBook || !selectedBookData) return
    saveProgress({
      version,
      book: selectedBook,
      chapter: selectedChapter,
      bookName: selectedBookData.book,
      verse: bookmarkedVerse ?? undefined,
    })
  }, [version, selectedBook, selectedChapter, initialized, selectedBookData, bookmarkedVerse])

  /* ── Handlers ── */
  const resumeReading = () => {
    if (!savedProgress) return
    setVersion(savedProgress.version)
    setSelectedBook(savedProgress.book)
    setSelectedChapter(savedProgress.chapter)
    setSavedProgress(null)
  }

  const isFav = (v: BibleVerse) =>
    favorites.some(f => f.book === v.book && f.chapter === v.chapter && f.verse === v.verse && f.version === v.version)

  const toggleFav = (v: BibleVerse) => {
    const updated = isFav(v)
      ? favorites.filter(f => !(f.book === v.book && f.chapter === v.chapter && f.verse === v.verse && f.version === v.version))
      : [...favorites, { ...v, savedAt: new Date().toISOString() }]
    setFavorites(updated)
    saveFavorites(updated)
  }

  const handleShare = async (v: BibleVerse) => {
    const url = `${window.location.origin}/verse/${v.version.toLowerCase()}/${v.abbrev}/${v.chapter}/${v.verse}`
    const text = `"${v.text}"\n— ${v.book} ${v.chapter}:${v.verse} (${v.version})`
    try {
      if (navigator.share) await navigator.share({ title: "Bíblia Sagrada", text, url })
      else {
        await navigator.clipboard.writeText(`${text}\n\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch { /* cancelado */ }
  }

  const turnPage = (dir: "next" | "prev") => {
    pendingDirRef.current = dir
    setHighlightedVerse(null)
  }

  const goNextChapter = () => {
    setBookmarkedVerse(null)
    if (selectedChapter < chaptersCount) {
      turnPage("next"); setSelectedChapter(selectedChapter + 1)
    } else {
      const idx = books.findIndex(b => b.abbrev === selectedBook)
      if (idx < books.length - 1) {
        turnPage("next"); setSelectedBook(books[idx + 1].abbrev); setSelectedChapter(1)
      }
    }
  }

  const goPrevChapter = () => {
    setBookmarkedVerse(null)
    if (selectedChapter > 1) {
      turnPage("prev"); setSelectedChapter(selectedChapter - 1)
    } else {
      const idx = books.findIndex(b => b.abbrev === selectedBook)
      if (idx > 0) {
        turnPage("prev")
        const prev = books[idx - 1]
        setSelectedBook(prev.abbrev); setSelectedChapter(prev.chapters.length)
      }
    }
  }

  const isFirstChapter = selectedChapter === 1 && books.findIndex(b => b.abbrev === selectedBook) === 0
  const isLastChapter  = selectedChapter === chaptersCount && books.findIndex(b => b.abbrev === selectedBook) === books.length - 1

  const bookIdx = books.findIndex(b => b.abbrev === selectedBook)
  const totalChapters = books.reduce((acc, b) => acc + b.chapters.length, 0)
  const chaptersBeforeBook = books.slice(0, bookIdx).reduce((acc, b) => acc + b.chapters.length, 0)
  const currentChapterGlobal = chaptersBeforeBook + selectedChapter
  const progressPct = totalChapters > 0 ? Math.round((currentChapterGlobal / totalChapters) * 100) : 0

  // Só mostra o banner de progresso se for um capítulo diferente do atual
  const showResumeBanner =
    savedProgress &&
    initialized &&
    (savedProgress.book !== selectedBook || savedProgress.chapter !== selectedChapter)

  /* ── Tema ── */
  const bg   = isDark ? "bg-slate-900"           : "bg-amber-50"
  const text = isDark ? "text-slate-100"          : "text-stone-800"
  const muted= isDark ? "text-slate-400"          : "text-stone-400"
  const num  = isDark ? "text-blue-400"           : "text-sky-500"
  const nav  = isDark ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-stone-200"
  const sep  = isDark ? "border-slate-700"        : "border-stone-200"

  /* ── Render ── */
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      {/* Tutorial */}
      {showTutorial && <ReaderTutorial onClose={() => setShowTutorial(false)} isDark={isDark} />}

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 border-b ${nav} backdrop-blur-md`}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className={`${muted} hover:text-current transition-colors`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <BookOpen className={`w-4 h-4 shrink-0 ${num}`} />
            <span className={`font-semibold text-sm truncate ${text}`}>
              {selectedBookData?.book ?? "—"} {selectedChapter}
            </span>
            <Badge variant="secondary" className="shrink-0 text-xs">{version}</Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${muted}`}
              onClick={() => setShowTutorial(true)} title="Ajuda">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${muted}`}
              onClick={() => setShowIndex(true)} title="Índice">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${muted}`}
              onClick={() => setTheme(isDark ? "light" : "dark")} title="Tema">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${muted}`}
              onClick={() => setShowSettings(true)} title="Configurações">
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Barra de progresso global */}
        <div className={`h-0.5 ${isDark ? "bg-slate-700" : "bg-stone-100"}`}>
          <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      {/* ── Conteúdo ─────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <div ref={topRef} />

        {/* Banner "continuar leitura" */}
        {showResumeBanner && (
          <div className={`mb-6 rounded-xl border p-4 flex items-center gap-3 cursor-pointer
            transition-all hover:scale-[1.01] animate-in slide-in-from-top-2 duration-300
            ${isDark ? "bg-blue-900/30 border-blue-700" : "bg-sky-50 border-sky-200"}`}
            onClick={resumeReading}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              ${isDark ? "bg-blue-800" : "bg-sky-100"}`}>
              <BookMarked className={`w-5 h-5 ${isDark ? "text-blue-300" : "text-sky-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-blue-400" : "text-sky-500"}`}>
                Continuar leitura
              </p>
              <p className={`text-sm font-medium truncate mt-0.5 ${text}`}>
                {savedProgress!.bookName} — Capítulo {savedProgress!.chapter}
                <span className={`ml-1.5 text-xs font-normal ${muted}`}>({savedProgress!.version})</span>
              </p>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${muted}`} />
          </div>
        )}

        {/* Cabeçalho do capítulo */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl sm:text-4xl font-bold ${text} tracking-tight`}
            style={{ fontFamily: "Georgia, serif" }}>
            {selectedBookData?.book}
          </h1>
          <p className={`mt-1 text-lg ${muted}`}>Capítulo {selectedChapter}</p>
          <div className={`mt-3 w-16 h-0.5 mx-auto ${isDark ? "bg-slate-600" : "bg-stone-300"}`} />
        </div>

        {/* Versículos */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-4 rounded ${isDark ? "bg-slate-700" : "bg-stone-200"}`}
                style={{ width: `${60 + (i * 7) % 35}%` }} />
            ))}
          </div>
        ) : (
          <div key={pageKey} className={`space-y-1 ${pageDir === "next" ? "page-in-next" : "page-in-prev"}`}>
            {verses.map((v) => (
              <div
                key={v.verse}
                id={`verse-${v.verse}`}
                className={`group relative flex gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer
                  ${bookmarkedVerse === v.verse
                    ? isDark
                      ? "bg-amber-900/25 border-l-4 border-amber-500 pl-2"
                      : "bg-amber-50 border-l-4 border-amber-400 pl-2"
                    : highlightedVerse === v.verse
                      ? isDark ? "bg-blue-900/40" : "bg-sky-50"
                      : isDark ? "hover:bg-slate-800" : "hover:bg-stone-50"}`}
                onClick={() => setHighlightedVerse(highlightedVerse === v.verse ? null : v.verse)}
              >
                <span className={`text-xs font-bold pt-1 min-w-[20px] select-none flex flex-col items-center gap-0.5
                  ${bookmarkedVerse === v.verse ? "text-amber-500" : num}`}>
                  {v.verse}
                  {bookmarkedVerse === v.verse && <Bookmark className="w-2.5 h-2.5 fill-current" />}
                </span>
                <p className={`flex-1 leading-relaxed ${text} ${fontSize}`}
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  {v.text}
                </p>
                <div className={`flex items-start gap-1 pt-0.5 transition-opacity
                  ${highlightedVerse === v.verse ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(v) }}
                    className={`p-1 rounded transition-colors ${isFav(v) ? "text-red-500" : `${muted} hover:text-red-400`}`}
                    title="Favoritar">
                    <Heart className={`w-3.5 h-3.5 ${isFav(v) ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); bookmarkVerse(v.verse) }}
                    className={`p-1 rounded transition-colors ${bookmarkedVerse === v.verse ? "text-amber-500" : `${muted} hover:text-amber-400`}`}
                    title="Marcar onde parei">
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedVerse === v.verse ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleShare(v) }}
                    className={`p-1 rounded transition-colors ${muted} hover:text-sky-500`}
                    title="Compartilhar">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navegação inferior */}
        <div className={`mt-12 pt-8 border-t ${sep} flex items-center justify-between gap-4`}>
          <Button variant="outline" onClick={goPrevChapter} disabled={isFirstChapter}
            className={`flex items-center gap-2 ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}`}>
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <div className="text-center">
            <p className={`text-xs ${muted}`}>{progressPct}% da Bíblia</p>
            <p className={`text-xs ${muted} mt-0.5`}>{currentChapterGlobal} de {totalChapters} cap.</p>
          </div>

          <Button variant="outline" onClick={goNextChapter} disabled={isLastChapter}
            className={`flex items-center gap-2 ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}`}>
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {copied && <p className={`text-center text-xs mt-4 ${muted}`}>Versículo copiado! ✓</p>}
      </main>

      {/* ── Sheet: Índice ─────────────────────────────────────────── */}
      <Sheet open={showIndex} onOpenChange={setShowIndex}>
        <SheetContent side="left" className={`w-80 ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : ""}`}>
          <SheetHeader>
            <SheetTitle className={isDark ? "text-slate-100" : ""}>Índice Bíblico</SheetTitle>
          </SheetHeader>
          <div className="mt-4 mb-3">
            <Select value={version} onValueChange={(v) => { setVersion(v); setShowIndex(false) }}>
              <SelectTrigger className={isDark ? "bg-slate-800 border-slate-600 text-slate-100" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {versions.map(v => (
                  <SelectItem key={v.abbreviation} value={v.abbreviation}>
                    {v.name} ({v.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className={isDark ? "bg-slate-700" : ""} />
          <ScrollArea className="h-[calc(100vh-160px)] mt-3">
            {["Antigo Testamento", "Novo Testamento"].map((testament) => {
              const testamentBooks = testament === "Antigo Testamento" ? books.slice(0, 39) : books.slice(39)
              return (
                <div key={testament} className="mb-4">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 px-1 ${isDark ? "text-slate-500" : "text-stone-400"}`}>
                    {testament}
                  </p>
                  {testamentBooks.map((b) => (
                    <button key={b.abbrev}
                      onClick={() => { setBookmarkedVerse(null); setSelectedBook(b.abbrev); setSelectedChapter(1); setShowIndex(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                        ${selectedBook === b.abbrev
                          ? isDark ? "bg-blue-900/50 text-blue-300 font-semibold" : "bg-sky-50 text-sky-700 font-semibold"
                          : isDark ? "text-slate-300 hover:bg-slate-800" : "text-stone-700 hover:bg-stone-50"}`}>
                      <span>{b.book}</span>
                      <span className={`text-xs ${isDark ? "text-slate-500" : "text-stone-400"}`}>{b.chapters.length} cap.</span>
                    </button>
                  ))}
                </div>
              )
            })}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* ── Sheet: Configurações ─────────────────────────────────── */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent className={`w-72 ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : ""}`}>
          <SheetHeader>
            <SheetTitle className={isDark ? "text-slate-100" : ""}>Configurações</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <p className={`text-sm font-semibold mb-3 ${isDark ? "text-slate-300" : "text-stone-600"}`}>
                Tamanho do texto
              </p>
              <div className="flex gap-2">
                {FONT_SIZES.map((f) => (
                  <button key={f.value} onClick={() => setFontSize(f.value)}
                    className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors
                      ${fontSize === f.value
                        ? isDark ? "bg-blue-700 border-blue-600 text-white" : "bg-sky-500 border-sky-500 text-white"
                        : isDark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                    title={f.desc}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Separator className={isDark ? "bg-slate-700" : ""} />
            <div>
              <p className={`text-sm font-semibold mb-3 ${isDark ? "text-slate-300" : "text-stone-600"}`}>
                Ir para o capítulo
              </p>
              <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto">
                {Array.from({ length: chaptersCount }, (_, i) => i + 1).map((n) => (
                  <button key={n}
                    onClick={() => { setBookmarkedVerse(null); turnPage(n > selectedChapter ? "next" : "prev"); setSelectedChapter(n); setShowSettings(false) }}
                    className={`h-9 rounded text-sm font-medium transition-colors
                      ${selectedChapter === n
                        ? isDark ? "bg-blue-700 text-white" : "bg-sky-500 text-white"
                        : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-stone-50 text-stone-600 hover:bg-stone-100"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <Separator className={isDark ? "bg-slate-700" : ""} />
            <button onClick={() => { setShowTutorial(true); setShowSettings(false) }}
              className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-400 hover:text-slate-200" : "text-stone-500 hover:text-stone-800"} transition-colors`}>
              <HelpCircle className="w-4 h-4" />
              Ver tutorial novamente
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
