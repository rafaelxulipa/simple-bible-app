import type { Metadata } from "next"
import { BibleReader } from "@/components/bible-reader"

export const metadata: Metadata = {
  title: "Leitura — Bíblia Sagrada",
  description: "Leia a Bíblia como um livro, capítulo por capítulo.",
}

interface Props {
  searchParams: Promise<{ book?: string; chapter?: string; verse?: string; version?: string }>
}

export default async function LeituraPage({ searchParams }: Props) {
  const p = await searchParams
  return (
    <BibleReader
      initialBook={p.book}
      initialChapter={p.chapter ? Number(p.chapter) : undefined}
      initialVerse={p.verse ? Number(p.verse) : undefined}
      initialVersion={p.version}
    />
  )
}
