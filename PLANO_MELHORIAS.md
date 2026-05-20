# Plano de Melhorias — Simple Bible App

> Levantamento feito em 2026-05-20. O app está funcional e estável. Este plano lista melhorias incrementais organizadas por categoria e prioridade.

---

## Visão Geral do App Atual

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Estilo**: Tailwind CSS + shadcn/ui (48 componentes disponíveis, maioria não utilizada)
- **Dados**: 3 versões da Bíblia em JSON (NVI, ACF, AA) — ~12MB carregados upfront
- **Estado**: localStorage apenas (sem backend)
- **PWA**: manifest.json presente, sem Service Worker registrado
- **Funcionalidades ativas**: versículo aleatório, troca de versão, onboarding (nome + igreja), tema claro

---

## Layout & Design

### L1 — Navegação sequencial de versículos
**Impacto: Alto**

Adicionar botões Anterior / Próximo para navegar linearmente pelo texto, além do botão "Versículo Aleatório" já existente. O usuário poderia ler um capítulo inteiro de forma contínua.

- Requer guardar posição atual (livro + capítulo + versículo) no estado
- Reaproveita `getSpecificVerse()` já existente em `data/bible-verses.ts`

---

### L2 — Toggle de modo escuro
**Impacto: Médio**

O `ThemeProvider` (next-themes) já está configurado no `layout.tsx`, mas não há nenhum botão de alternância visível na UI.

- Adicionar ícone de lua/sol no canto superior da `VerseDisplay`
- Uma linha com `useTheme()` + `setTheme()`

---

### L3 — Tela de splash animada
**Impacto: Baixo**

Exibir logo com fade-in ao abrir o app, melhorando a percepção de PWA instalado.

- Pode ser feito com `AnimatePresence` (Framer Motion) ou CSS puro
- Exibir por ~1.5s antes de mostrar `WelcomeForm` ou `VerseDisplay`

---

### L4 — Tipografia serifada para versículos
**Impacto: Médio**

Fontes serifadas (Georgia, Merriweather, Lora) são associadas à leitura bíblica e melhoram legibilidade de textos longos.

- Adicionar fonte via `next/font` ou Google Fonts
- Aplicar apenas ao bloco do versículo, não à interface geral

---

## Funcionalidades

### F1 — Busca por versículo ou palavra-chave
**Impacto: Alto**

Permitir que o usuário pesquise por referência (ex: "João 3:16") ou palavra-chave no texto.

- Busca por referência: parse simples de string
- Busca por palavra-chave: filtro nos arrays de versículos (pode ser lento nos 4MB — considerar indexação simples)
- Usar o componente `Command` do shadcn/ui já disponível no projeto

---

### F2 — Favoritos
**Impacto: Alto**

Salvar versículos favoritos no localStorage com botão de coração na tela principal.

- Estrutura: `simpleBible:favorites` → array de `{ version, book, chapter, verse, text }`
- Tela de listagem de favoritos (Sheet ou página separada)
- Fácil de implementar, grande valor percebido

---

### F3 — Navegação por livro e capítulo
**Impacto: Alto**

Permitir selecionar um livro e capítulo para leitura contínua, não dependendo do aleatório.

- Seletor de livro → seletor de capítulo → exibir todos os versículos
- `getBooksFromVersion()` já existe; falta UI de seleção
- Pode ser uma rota separada: `/leitura/[livro]/[capitulo]`

---

### F4 — Compartilhar versículo
**Impacto: Médio**

Botão de compartilhamento usando a Web Share API nativa (`navigator.share`), com fallback para copiar texto.

```
"{texto do versículo}"
— {Livro} {capítulo}:{versículo} ({versão})
Compartilhado via Bíblia Sagrada App
```

- Implementação rápida (~30 linhas)
- Muito relevante para o perfil de usuário do app

---

### F5 — Versículo do dia
**Impacto: Médio**

Exibir o mesmo versículo durante todo o dia (baseado na data como seed), diferente do aleatório por clique.

- Usar `new Date().toDateString()` como seed para seleção determinística
- Salvar no localStorage com a data para evitar recalcular
- Pode conviver com o botão "Novo Versículo" para versículos avulsos

---

### F6 — Histórico de versículos
**Impacto: Baixo**

Listar os últimos versículos exibidos na sessão atual.

- Estado simples em memória (array de versículos)
- Exibir em um Sheet/Drawer lateral
- Útil para voltar a um versículo que apareceu aleatoriamente

---

## Técnico / PWA

### T1 — Service Worker para modo offline
**Impacto: Médio**

O `manifest.json` existe mas não há SW registrado. Sem ele, o app não funciona offline após instalação.

- Usar `next-pwa` ou `workbox` para geração automática do SW
- Cachear os JSONs das bíblias para uso offline total
- Pré-requisito para publicação nas lojas como PWA completo

---

### T2 — Lazy load dos dados das bíblias
**Impacto: Alto (performance)**

Atualmente os 3 JSONs (~12MB) são importados diretamente em `bible-verses.ts`. Isso aumenta o bundle inicial.

- Carregar apenas a versão ativa via `import()` dinâmico ou rota de API Next.js
- Reduz o tempo de carregamento inicial significativamente
- Ao trocar de versão, carregar o novo JSON sob demanda

---

### T3 — Rotas por versículo para compartilhamento
**Impacto: Médio**

Criar rotas como `/gn/1/1` ou `/joao/3/16` para que versículos compartilhados abram diretamente no app.

- Permite compartilhar links clicáveis (além do texto)
- Pré-requisito para funcionar bem com Open Graph (preview social)
- Reaproveita `getSpecificVerse()` existente

---

## Prioridade Sugerida

### Fase 1 — Ganhos rápidos (baixo esforço, alto retorno)
1. **F4** — Compartilhar versículo
2. **L2** — Toggle modo escuro
3. **F5** — Versículo do dia

### Fase 2 — Funcionalidades core
4. **F2** — Favoritos
5. **L1** — Navegação sequencial (anterior/próximo)
6. **L4** — Tipografia serifada

### Fase 3 — Funcionalidades avançadas
7. **F1** — Busca por versículo/palavra-chave
8. **F3** — Navegação por livro e capítulo
9. **T2** — Lazy load dos dados

### Fase 4 — PWA e infraestrutura
10. **T1** — Service Worker / modo offline
11. **T3** — Rotas por versículo
12. **L3** — Tela de splash

---

## Stack Disponível (sem instalar nada novo)

Todos os itens da Fase 1 e Fase 2 podem ser implementados usando apenas o que já está no projeto:

- `shadcn/ui`: Button, Sheet, Command, Dialog, Badge, ScrollArea, Separator
- `lucide-react`: Heart, Share2, Moon, Sun, ChevronLeft, ChevronRight, Bookmark
- `next-themes`: toggle de tema
- `localStorage`: favoritos, histórico, versículo do dia
- `navigator.share`: compartilhamento nativo

---

*Documento gerado como base de discussão. Cada item pode ser detalhado e estimado antes da implementação.*
