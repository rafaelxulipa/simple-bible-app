import type { Metadata } from "next"
import Link from "next/link"
import { getSpecificVerse, getAvailableVersions } from "@/data/bible-verses"
import { CelestialBackground } from "@/components/celestial-background"

interface Props {
  params: Promise<{ version: string; book: string; chapter: string; verse: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version, book, chapter, verse } = await params
  const v = await getSpecificVerse(version.toUpperCase(), book, Number(chapter), Number(verse))

  if (!v) return { title: "Versículo não encontrado — Bíblia Sagrada" }

  const title = `${v.book} ${v.chapter}:${v.verse} (${v.version})`
  const description = `"${v.text}"`

  return {
    title: `${title} — Bíblia Sagrada`,
    description,
    openGraph: { title, description, siteName: "Bíblia Sagrada", locale: "pt-BR", type: "article" },
    twitter: { card: "summary", title, description },
  }
}

export default async function VersePage({ params }: Props) {
  const { version, book, chapter, verse } = await params
  const v = await getSpecificVerse(version.toUpperCase(), book, Number(chapter), Number(verse))
  const versions = getAvailableVersions()

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <CelestialBackground />

      <div className="relative z-10 w-full max-w-lg">
        {v ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Faixa superior */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

            <div className="p-8 space-y-6 text-center">
              {/* Logo + título */}
              <div className="flex items-center justify-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo192.png" alt="Bíblia Sagrada" className="w-10 h-10 rounded-xl shadow" />
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Bíblia Sagrada</p>
              </div>

              {/* Versículo */}
              <blockquote
                className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed italic px-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                "{v.text}"
              </blockquote>

              {/* Referência */}
              <div className="space-y-1">
                <p className="text-blue-600 font-bold text-lg">
                  {v.book} {v.chapter}:{v.verse}
                </p>
                <p className="text-sm text-gray-400">
                  {versions.find((x) => x.abbreviation === v.version)?.name}
                </p>
              </div>

              {/* Outras versões */}
              <div className="pt-1">
                <p className="text-xs text-gray-400 mb-2">Ver em outra versão:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {versions
                    .filter((x) => x.abbreviation !== v.version)
                    .map((x) => (
                      <Link
                        key={x.abbreviation}
                        href={`/verse/${x.abbreviation.toLowerCase()}/${book}/${chapter}/${verse}`}
                        className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1 rounded-full transition-colors border border-sky-200"
                      >
                        {x.abbreviation}
                      </Link>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                📖 Abrir o App
              </Link>
            </div>

            <div className="h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300" />
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center space-y-4">
            <p className="text-gray-600">Versículo não encontrado.</p>
            <Link href="/" className="text-sky-600 hover:underline font-medium">
              Voltar ao início
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
