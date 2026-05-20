# Acompanhamento de Implementações

> Atualizado em: 2026-05-20

---

## Legenda
- ✅ Implementado
- 🔄 Em andamento
- ⏳ Pendente
- ❌ Descartado

---

## Fase 1 — Ganhos Rápidos

| ID | Melhoria | Status | Data | Arquivo(s) |
|----|----------|--------|------|------------|
| F4 | Compartilhar versículo (Web Share API + fallback clipboard) | ✅ | 2026-05-20 | `components/verse-display.tsx` |
| L2 | Toggle modo escuro (sol/lua) | ✅ | 2026-05-20 | `components/verse-display.tsx`, `app/layout.tsx` |
| F5 | Versículo do dia (determinístico por data) | ✅ | 2026-05-20 | `data/bible-verses.ts`, `components/verse-display.tsx` |

---

## Fase 2 — Funcionalidades Core

| ID | Melhoria | Status | Data | Arquivo(s) |
|----|----------|--------|------|------------|
| F2 | Favoritos (localStorage + sheet lateral) | ✅ | 2026-05-20 | `components/verse-display.tsx` |
| L1 | Navegação sequencial (anterior/próximo com histórico) | ✅ | 2026-05-20 | `components/verse-display.tsx` |
| L4 | Tipografia serifada (Georgia) nos versículos | ✅ | 2026-05-20 | `components/verse-display.tsx` |

---

## Fase 3 — Funcionalidades Avançadas

| ID | Melhoria | Status | Data | Arquivo(s) |
|----|----------|--------|------|------------|
| F1 | Busca por palavra/frase no texto bíblico | ✅ | 2026-05-20 | `data/bible-verses.ts`, `components/verse-display.tsx` |
| F3 | Navegação por livro e capítulo (leitura contínua) | ✅ | 2026-05-20 | `data/bible-verses.ts`, `components/verse-display.tsx` |
| T2 | Lazy load dos JSONs da bíblia (bundle inicial menor) | ✅ | 2026-05-20 | `data/bible-verses.ts`, `components/verse-display.tsx` |

---

## Fase 4 — PWA e Infraestrutura

| ID | Melhoria | Status | Data | Arquivo(s) |
|----|----------|--------|------|------------|
| T1 | Service Worker / modo offline | ✅ | 2026-05-20 | `public/sw.js`, `app/layout.tsx` |
| T3 | Rotas por versículo (`/verse/[version]/[book]/[chapter]/[verse]`) | ✅ | 2026-05-20 | `app/verse/[version]/[book]/[chapter]/[verse]/page.tsx` |
| L3 | Tela de splash animada ao abrir o app | ✅ | 2026-05-20 | `components/splash-screen.tsx`, `app/page.tsx` |

---

## Detalhes de Implementação

### F4 — Compartilhar versículo
Usa `navigator.share` (nativo em mobile) com fallback para `navigator.clipboard.writeText` no desktop.
Exibe "Copiado!" por 2 segundos após cópia bem-sucedida.

### L2 — Modo escuro
`ThemeProvider` (next-themes) adicionado ao `layout.tsx` com `attribute="class"` e `defaultTheme="light"`.
Background alterna entre gradiente azul (claro) e gradiente slate (escuro).
Nuvens animadas exibidas apenas no tema claro.

### F5 — Versículo do dia
Função `getDailyVerse()` em `bible-verses.ts` usa a data como seed (`YYYYMMDD` → inteiro) para seleção determinística. O mesmo versículo é exibido para todos os usuários durante o dia inteiro.

### F2 — Favoritos
Persistido em `localStorage` na chave `simpleBible:favorites` como array de `FavoriteVerse[]`.
Badge vermelho no botão do header indica quantidade de favoritos.
Sheet lateral lista todos com opções de compartilhar e remover.

### L1 — Navegação sequencial
Implementado como histórico de versículos em memória (`verseHistory[]` + `historyIndex`).
Botão "Próximo" avança no histórico ou sorteia um novo se já estiver no fim.
Botão "Anterior" retorna ao versículo anterior da sessão.

### L4 — Tipografia serifada
`fontFamily: "Georgia, 'Times New Roman', serif"` aplicado via `style` prop em todos os blocos de texto bíblico (versículo aleatório, diário, navegação por capítulo e resultados de busca).

### F1 — Busca
Função `searchVerses()` em `bible-verses.ts` varre todos os versículos da versão selecionada.
Limitada a 50 resultados para evitar travamento.
Busca é disparada ao clicar em "Buscar" ou pressionar Enter (não em tempo real, para preservar performance com os 4MB de dados).

### F3 — Navegação por livro/capítulo
Função `getChapterVerses()` em `bible-verses.ts` retorna todos os versículos de um capítulo.
Interface com dois `Select` (livro + capítulo) e lista com `ScrollArea`.
Hover revela botões de favoritar e compartilhar em cada versículo.

---

### T2 — Lazy Load dos JSONs
`bible-verses.ts` convertido para importações dinâmicas assíncronas com cache em memória por sessão. Apenas a versão ativa (padrão: NVI) é carregada na inicialização. ACF e AA só carregam se o usuário trocar de versão. Reduz o bundle inicial de ~12MB para ~4MB.

### T3 — Rota por Versículo
Rota dinâmica SSR em `/verse/[version]/[book]/[chapter]/[verse]` com `generateMetadata` para Open Graph e Twitter Card. Exibe o versículo compartilhado com links para trocar de versão e CTA para abrir o app. O botão de compartilhar agora inclui a URL da rota.

### L3 — Splash Screen
Componente `SplashScreen` exibido por ~1.9s na abertura do app (fade out suave). Mostra logo SVG, título e animação de dots. Integrado em `page.tsx` — substitui o delay de hydration anterior.

### T1 — Service Worker
`public/sw.js` com estratégia cache-first para assets estáticos e chunks Next.js (incluindo os JSONs da Bíblia após primeiro carregamento), e network-first para navegação. Registrado via `<Script strategy="afterInteractive">` no layout.

### Extras
- `public/favicon.svg` — favicon vetorial com livro e cruz em gradiente azul, referenciado no `<head>` com prioridade sobre o `.ico`.

---

## Todas as melhorias concluídas ✅

Todas as 12 melhorias do plano original foram implementadas.
