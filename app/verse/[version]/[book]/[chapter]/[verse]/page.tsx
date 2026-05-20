import type { Metadata } from "next"
import Link from "next/link"
import { getSpecificVerse, getAvailableVersions } from "@/data/bible-verses"

interface Props {
  params: Promise<{ version: string; book: string; chapter: string; verse: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version, book, chapter, verse } = await params
  const v = await getSpecificVerse(version.toUpperCase(), book, Number(chapter), Number(verse))

  if (!v) {
    return { title: "Versículo não encontrado — Bíblia Sagrada" }
  }

  const title = `${v.book} ${v.chapter}:${v.verse} (${v.version})`
  const description = `"${v.text}"`

  return {
    title: `${title} — Bíblia Sagrada`,
    description,
    openGraph: {
      title,
      description,
      siteName: "Bíblia Sagrada",
      locale: "pt-BR",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function VersePage({ params }: Props) {
  const { version, book, chapter, verse } = await params
  const v = await getSpecificVerse(version.toUpperCase(), book, Number(chapter), Number(verse))
  const versions = getAvailableVersions()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        {v ? (
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 space-y-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Bíblia Sagrada</p>
            <blockquote
              className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed italic"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              "{v.text}"
            </blockquote>
            <div>
              <p className="text-blue-600 font-bold text-lg">
                {v.book} {v.chapter}:{v.verse}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {versions.find((x) => x.abbreviation === v.version)?.name}
              </p>
            </div>

            {/* Links para outras versões */}
            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-2">Ver em outra versão:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {versions
                  .filter((x) => x.abbreviation !== v.version)
                  .map((x) => (
                    <Link
                      key={x.abbreviation}
                      href={`/verse/${x.abbreviation.toLowerCase()}/${book}/${chapter}/${verse}`}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {x.abbreviation}
                    </Link>
                  ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 hover:scale-105"
            >
              Abrir o App 📖
            </Link>
          </div>
        ) : (
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 text-center space-y-4">
            <p className="text-gray-600">Versículo não encontrado.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Voltar ao início
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
