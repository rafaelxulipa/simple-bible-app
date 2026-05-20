export interface BibleBook {
  abbrev: string
  book: string
  chapters: string[][]
}

export interface BibleVerse {
  book: string
  abbrev: string
  chapter: number
  verse: number
  text: string
  version: string
}

export interface BibleVersion {
  name: string
  abbreviation: string
}

const VERSION_META: BibleVersion[] = [
  { name: "Nova Versão Internacional", abbreviation: "NVI" },
  { name: "Almeida Corrigida e Fiel", abbreviation: "ACF" },
  { name: "Almeida Revisada Imprensa Bíblica", abbreviation: "AA" },
]

// Cache em memória — cada versão carrega no máximo uma vez por sessão
const bookCache: Record<string, BibleBook[]> = {}

async function loadBooks(versionAbbr: string): Promise<BibleBook[]> {
  if (bookCache[versionAbbr]) return bookCache[versionAbbr]

  let data: { default: BibleBook[] }
  if (versionAbbr === "NVI") {
    data = await import("./nvi.json")
  } else if (versionAbbr === "ACF") {
    data = await import("./acf.json")
  } else {
    data = await import("./aa.json")
  }

  bookCache[versionAbbr] = data.default as BibleBook[]
  return bookCache[versionAbbr]
}

export function getAvailableVersions(): BibleVersion[] {
  return VERSION_META
}

export async function getRandomVerse(versionAbbr = "NVI"): Promise<BibleVerse | null> {
  const books = await loadBooks(versionAbbr)
  if (!books.length) return null

  const bookIndex = Math.floor(Math.random() * books.length)
  const book = books[bookIndex]
  if (!book.chapters?.length) return null

  const chapterIndex = Math.floor(Math.random() * book.chapters.length)
  const chapter = book.chapters[chapterIndex]
  if (!chapter?.length) return null

  const verseIndex = Math.floor(Math.random() * chapter.length)

  return {
    book: book.book,
    abbrev: book.abbrev,
    chapter: chapterIndex + 1,
    verse: verseIndex + 1,
    text: chapter[verseIndex],
    version: versionAbbr,
  }
}

export async function getDailyVerse(versionAbbr = "NVI"): Promise<BibleVerse | null> {
  const books = await loadBooks(versionAbbr)
  if (!books.length) return null

  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  const bookIndex = seed % books.length
  const book = books[bookIndex]
  if (!book.chapters?.length) return null

  const chapterIndex = (seed * 7) % book.chapters.length
  const chapter = book.chapters[chapterIndex]
  if (!chapter?.length) return null

  const verseIndex = (seed * 13) % chapter.length

  return {
    book: book.book,
    abbrev: book.abbrev,
    chapter: chapterIndex + 1,
    verse: verseIndex + 1,
    text: chapter[verseIndex],
    version: versionAbbr,
  }
}

export async function getBooksFromVersion(versionAbbr: string): Promise<BibleBook[]> {
  return loadBooks(versionAbbr)
}

export async function getChapterVerses(
  versionAbbr: string,
  bookAbbrev: string,
  chapter: number,
): Promise<BibleVerse[]> {
  const books = await loadBooks(versionAbbr)
  const book = books.find((b) => b.abbrev === bookAbbrev)
  if (!book) return []

  const chapterData = book.chapters[chapter - 1]
  if (!chapterData) return []

  return chapterData.map((text, i) => ({
    book: book.book,
    abbrev: book.abbrev,
    chapter,
    verse: i + 1,
    text,
    version: versionAbbr,
  }))
}

export async function searchVerses(versionAbbr: string, query: string): Promise<BibleVerse[]> {
  const books = await loadBooks(versionAbbr)
  if (!query.trim()) return []

  const results: BibleVerse[] = []
  const lower = query.toLowerCase()

  for (const book of books) {
    for (let c = 0; c < book.chapters.length; c++) {
      for (let v = 0; v < book.chapters[c].length; v++) {
        if (book.chapters[c][v].toLowerCase().includes(lower)) {
          results.push({
            book: book.book,
            abbrev: book.abbrev,
            chapter: c + 1,
            verse: v + 1,
            text: book.chapters[c][v],
            version: versionAbbr,
          })
          if (results.length >= 50) return results
        }
      }
    }
  }

  return results
}

export async function getSpecificVerse(
  versionAbbr: string,
  bookAbbrev: string,
  chapter: number,
  verse: number,
): Promise<BibleVerse | null> {
  const books = await loadBooks(versionAbbr)
  const book = books.find((b) => b.abbrev === bookAbbrev)
  if (!book) return null

  const chapterData = book.chapters[chapter - 1]
  if (!chapterData) return null

  const verseText = chapterData[verse - 1]
  if (!verseText) return null

  return {
    book: book.book,
    abbrev: book.abbrev,
    chapter,
    verse,
    text: verseText,
    version: versionAbbr,
  }
}
