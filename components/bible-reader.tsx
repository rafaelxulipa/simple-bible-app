"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, BookOpen, Settings2,
  Heart, Share2, ArrowLeft, List, Moon, Sun,
  BookMarked, Bookmark, Type, HelpCircle, X, Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CelestialBackground } from "@/components/celestial-background"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  getBooksFromVersion,
  getChapterVerses,
  DEFAULT_VERSION_ABBR,
  type BibleBook,
  type BibleVerse,
} from "@/data/bible-verses"
import { getSelectedVersion } from "@/lib/version-storage"

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

function normalizeSearch(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

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

function ReaderTutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const isLast = step === TUTORIAL_STEPS.length - 1
  const { icon, title, desc } = TUTORIAL_STEPS[step]

  const finish = () => { markTutorialDone(); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-800">
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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-sky-50 dark:bg-slate-700">
            {icon}
          </div>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-slate-300">
            {desc}
          </p>
        </div>

        {/* Dots + botões */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-5 bg-sky-500"
                  : "w-1.5 bg-stone-200 dark:bg-slate-600"
              }`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}
                className="text-stone-400 dark:text-slate-400">
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
  const router = useRouter()
  const [version, setVersion]           = useState(initialVersion ?? DEFAULT_VERSION_ABBR)
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
  const [activeVerse, setActiveVerse]         = useState<BibleVerse | null>(null)
  const [bookmarkConfirm, setBookmarkConfirm] = useState(false)
  const [bookSearch, setBookSearch] = useState("")
  const [chapterSearch, setChapterSearch] = useState("")
  const topRef = useRef<HTMLDivElement>(null)
  const pendingDirRef = useRef<"next" | "prev">("next")
  const pendingScrollVerseRef = useRef<number | null>(initialVerse ?? null)

  const selectedBookData = books.find((b) => b.abbrev === selectedBook)
  const chaptersCount = selectedBookData?.chapters.length ?? 0

  /* ── Inicialização ── */
  useEffect(() => {
    setFavorites(loadFavorites())
    setSavedProgress(loadProgress())
    if (!hasDoneTutorial()) setShowTutorial(true)
    if (!initialVersion) {
      const stored = getSelectedVersion()
      if (stored) setVersion(stored)
    }
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
  const chaptersBeforeBook = bookIdx > 0 ? books.slice(0, bookIdx).reduce((acc, b) => acc + b.chapters.length, 0) : 0
  const currentChapterGlobal = chaptersBeforeBook + selectedChapter
  const progressPct = totalChapters > 0 && bookIdx >= 0
    ? Math.max(1, Math.round((currentChapterGlobal / totalChapters) * 100))
    : 0

  // Só mostra o banner de progresso se for um capítulo diferente do atual
  const showResumeBanner =
    savedProgress &&
    initialized &&
    (savedProgress.book !== selectedBook || savedProgress.chapter !== selectedChapter)

  /* ── Render ── */
  return (
    <div className="min-h-screen relative">
      <CelestialBackground />

      {/* Tutorial */}
      {showTutorial && <ReaderTutorial onClose={() => setShowTutorial(false)} />}

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="relative z-40 sticky top-0 border-b bg-white/90 border-stone-200 dark:bg-slate-800/90 dark:border-slate-700 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-stone-400 dark:text-slate-400 hover:text-current transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 shrink-0 text-sky-500 dark:text-blue-400" />
            <span className="font-semibold text-sm truncate text-stone-800 dark:text-slate-100">
              {selectedBookData?.book ?? "—"} {selectedChapter}
            </span>
            <Badge variant="secondary" className="shrink-0 text-xs">{version}</Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-400 dark:text-slate-400"
              onClick={() => setShowTutorial(true)} title="Ajuda">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-400 dark:text-slate-400"
              onClick={() => setShowIndex(true)} title="Índice">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-400 dark:text-slate-400"
              onClick={() => setShowSettings(true)} title="Configurações">
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Barra de progresso global */}
        <div className="h-0.5 bg-stone-100 dark:bg-slate-700">
          <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      {/* ── Conteúdo ─────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <div ref={topRef} />

        {/* Banner "continuar leitura" */}
        {showResumeBanner && (
          <div className="mb-6 rounded-xl border p-4 flex items-center gap-3 cursor-pointer
            transition-all hover:scale-[1.01] animate-in slide-in-from-top-2 duration-300
            bg-sky-50 border-sky-200 dark:bg-blue-900/30 dark:border-blue-700"
            onClick={resumeReading}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              bg-sky-100 dark:bg-blue-800">
              <BookMarked className="w-5 h-5 text-sky-600 dark:text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-500 dark:text-blue-400">
                Continuar leitura
              </p>
              <p className="text-sm font-medium truncate mt-0.5 text-stone-800 dark:text-slate-100">
                {savedProgress!.bookName} — Capítulo {savedProgress!.chapter}
                <span className="ml-1.5 text-xs font-normal text-stone-400 dark:text-slate-400">({savedProgress!.version})</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 text-stone-400 dark:text-slate-400" />
          </div>
        )}

        {/* Card de leitura */}
        <div className="rounded-2xl shadow-xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          {/* Faixa superior */}
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

          <div className="px-4 sm:px-8 py-8">
          {/* Cabeçalho do capítulo */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 dark:text-slate-100 tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}>
              {selectedBookData?.book}
            </h1>
            <p className="mt-1 text-lg text-stone-400 dark:text-slate-400">Capítulo {selectedChapter}</p>
            <div className="mt-3 w-16 h-0.5 mx-auto bg-stone-300 dark:bg-slate-600" />
          </div>

        {/* Versículos */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-stone-200 dark:bg-slate-700"
                style={{ width: `${60 + (i * 7) % 35}%` }} />
            ))}
          </div>
        ) : (
          <div key={pageKey} className={`space-y-1 ${pageDir === "next" ? "page-in-next" : "page-in-prev"}`}>
            {verses.map((v) => (
              <div
                key={v.verse}
                id={`verse-${v.verse}`}
                onClick={() => { setActiveVerse(v); setBookmarkConfirm(false) }}
                className={`relative flex gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer select-none
                  ${bookmarkedVerse === v.verse
                    ? "bg-amber-50 border-l-4 border-amber-400 pl-2 dark:bg-amber-900/25 dark:border-amber-500"
                    : "hover:bg-stone-50 active:bg-stone-100 dark:hover:bg-slate-800 dark:active:bg-slate-800"}`}
              >
                <span className={`text-xs font-bold pt-1 min-w-[20px] select-none flex flex-col items-center gap-0.5
                  ${bookmarkedVerse === v.verse ? "text-amber-500" : "text-sky-500 dark:text-blue-400"}`}>
                  {v.verse}
                  {bookmarkedVerse === v.verse && <Bookmark className="w-2.5 h-2.5 fill-current" />}
                </span>
                <p className={`flex-1 leading-relaxed text-stone-800 dark:text-slate-100 ${fontSize}`}
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navegação inferior */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={goPrevChapter} disabled={isFirstChapter}
            className="flex items-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <div className="text-center">
            <p className="text-xs text-stone-400 dark:text-slate-400">{progressPct}% da Bíblia</p>
            <p className="text-xs text-stone-400 dark:text-slate-400 mt-0.5">{currentChapterGlobal} de {totalChapters} cap.</p>
          </div>

          <Button variant="outline" onClick={goNextChapter} disabled={isLastChapter}
            className="flex items-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {copied && <p className="text-center text-xs mt-4 text-stone-400 dark:text-slate-400">Versículo copiado! ✓</p>}
          </div>
          <div className="h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300" />
        </div>{/* fim card de leitura */}
      </main>

      {/* ── Modal de ações do versículo ───────────────────────────── */}
      {activeVerse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setActiveVerse(null); setBookmarkConfirm(false) }} />

          {/* Painel */}
          <div
            className="relative w-full max-w-sm rounded-2xl shadow-2xl p-6 z-10
              bg-white text-stone-900 dark:bg-slate-900 dark:text-slate-100">

            {!bookmarkConfirm ? (
              <>
                {/* Preview do versículo */}
                <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-stone-400 dark:text-slate-400">
                  {activeVerse.book} {activeVerse.chapter}:{activeVerse.verse}
                </p>
                <p className="text-sm leading-relaxed mb-6 line-clamp-3 text-stone-700 dark:text-slate-300"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  {activeVerse.text}
                </p>

                {/* Ações */}
                <div className="flex flex-col gap-3">
                  <button type="button"
                    onClick={() => { toggleFav(activeVerse); setActiveVerse(null) }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors
                      ${isFav(activeVerse)
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}>
                    <Heart className={`w-5 h-5 ${isFav(activeVerse) ? "fill-current" : ""}`} />
                    <span className="font-medium">{isFav(activeVerse) ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
                  </button>

                  <button type="button"
                    onClick={() => {
                      if (bookmarkedVerse === activeVerse.verse) {
                        setBookmarkedVerse(null)
                        setActiveVerse(null)
                      } else {
                        setBookmarkConfirm(true)
                      }
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors
                      ${bookmarkedVerse === activeVerse.verse
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}>
                    <Bookmark className={`w-5 h-5 ${bookmarkedVerse === activeVerse.verse ? "fill-current" : ""}`} />
                    <span className="font-medium">
                      {bookmarkedVerse === activeVerse.verse ? "Remover marcador" : "Marcar onde parei"}
                    </span>
                  </button>

                  <button type="button"
                    onClick={() => {
                      const txt = `"${activeVerse.text}" — ${activeVerse.book} ${activeVerse.chapter}:${activeVerse.verse} (${version})`
                      if (navigator.share) {
                        navigator.share({ text: txt }).catch(() => {})
                      } else {
                        navigator.clipboard.writeText(txt).then(() => setCopied(true))
                      }
                      setActiveVerse(null)
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors
                      bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Compartilhar versículo</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-base font-semibold mb-2 text-stone-900 dark:text-slate-100">
                  Marcar onde parei?
                </p>
                <p className="text-sm mb-6 text-stone-500 dark:text-slate-400">
                  O versículo {activeVerse.book} {activeVerse.chapter}:{activeVerse.verse} será salvo como seu marcador de leitura. Você será direcionado à página inicial.
                </p>
                <div className="flex gap-3">
                  <button type="button"
                    onClick={() => setBookmarkConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-medium transition-colors
                      bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    Cancelar
                  </button>
                  <button type="button"
                    onClick={() => {
                      setBookmarkedVerse(activeVerse.verse)
                      setActiveVerse(null)
                      setBookmarkConfirm(false)
                      router.push("/")
                    }}
                    className="flex-1 py-3 rounded-xl font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors">
                    Sim, marcar aqui
                  </button>
                </div>
              </>
            )}

            {/* Fechar */}
            <button type="button"
              onClick={() => { setActiveVerse(null); setBookmarkConfirm(false) }}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors
                text-stone-400 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Sheet: Índice ─────────────────────────────────────────── */}
      <Sheet open={showIndex} onOpenChange={(open) => { setShowIndex(open); if (!open) setBookSearch("") }}>
        <SheetContent side="left" className="w-80 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
          <SheetHeader>
            <SheetTitle className="dark:text-slate-100 flex items-center gap-2">
              Índice Bíblico
              <Badge variant="secondary" className="text-xs font-normal">{version}</Badge>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 mb-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-slate-500" />
            <Input
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder="Buscar livro..."
              className="pl-9 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            />
          </div>
          <Separator className="dark:bg-slate-700" />
          <ScrollArea className="h-[calc(100vh-190px)] mt-3">
            {(() => {
              const query = normalizeSearch(bookSearch.trim())
              const filterBooks = (list: BibleBook[]) =>
                query === "" ? list : list.filter((b) => normalizeSearch(b.book).includes(query))
              const oldT = filterBooks(books.slice(0, 39))
              const newT = filterBooks(books.slice(39))
              if (query !== "" && oldT.length === 0 && newT.length === 0) {
                return <p className="text-center text-sm py-8 text-stone-400 dark:text-slate-500">Nenhum livro encontrado.</p>
              }
              return ["Antigo Testamento", "Novo Testamento"].map((testament) => {
                const testamentBooks = testament === "Antigo Testamento" ? oldT : newT
                if (testamentBooks.length === 0) return null
                return (
                  <div key={testament} className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 px-1 text-stone-400 dark:text-slate-500">
                      {testament}
                    </p>
                    {testamentBooks.map((b) => (
                      <button key={b.abbrev}
                        onClick={() => { setBookmarkedVerse(null); setSelectedBook(b.abbrev); setSelectedChapter(1); setShowIndex(false) }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                          ${selectedBook === b.abbrev
                            ? "bg-sky-50 text-sky-700 font-semibold dark:bg-blue-900/50 dark:text-blue-300"
                            : "text-stone-700 hover:bg-stone-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                        <span>{b.book}</span>
                        <span className="text-xs text-stone-400 dark:text-slate-500">{b.chapters.length} cap.</span>
                      </button>
                    ))}
                  </div>
                )
              })
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* ── Sheet: Configurações ─────────────────────────────────── */}
      <Sheet open={showSettings} onOpenChange={(open) => { setShowSettings(open); if (!open) setChapterSearch("") }}>
        <SheetContent className="w-72 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
          <SheetHeader>
            <SheetTitle className="dark:text-slate-100">Configurações</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-semibold mb-3 text-stone-600 dark:text-slate-300">
                Tamanho do texto
              </p>
              <div className="flex gap-2">
                {FONT_SIZES.map((f) => (
                  <button key={f.value} onClick={() => setFontSize(f.value)}
                    className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors
                      ${fontSize === f.value
                        ? "bg-sky-500 border-sky-500 text-white dark:bg-blue-700 dark:border-blue-600"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                    title={f.desc}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Separator className="dark:bg-slate-700" />
            <div>
              <p className="text-sm font-semibold mb-3 text-stone-600 dark:text-slate-300">
                Ir para o capítulo
              </p>
              {chaptersCount > 12 && (
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
                  <Input
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    placeholder="Buscar capítulo..."
                    className="h-8 pl-8 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>
              )}
              <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto">
                {Array.from({ length: chaptersCount }, (_, i) => i + 1)
                  .filter((n) => chapterSearch.trim() === "" || String(n).includes(chapterSearch.trim()))
                  .map((n) => (
                    <button key={n}
                      onClick={() => { setBookmarkedVerse(null); turnPage(n > selectedChapter ? "next" : "prev"); setSelectedChapter(n); setShowSettings(false); setChapterSearch("") }}
                      className={`h-9 rounded text-sm font-medium transition-colors
                        ${selectedChapter === n
                          ? "bg-sky-500 text-white dark:bg-blue-700"
                          : "bg-stone-50 text-stone-600 hover:bg-stone-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}>
                      {n}
                    </button>
                  ))}
              </div>
            </div>
            <Separator className="dark:bg-slate-700" />
            <button onClick={() => { setShowTutorial(true); setShowSettings(false) }}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <HelpCircle className="w-4 h-4" />
              Ver tutorial novamente
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
