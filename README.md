📖 Simple Bible App
Visão geral

Aplicativo leve para leitura da Bíblia, com versão web e mobile. Projetado para ser simples, acessível e fácil de expandir com recursos como favoritos, anotações e modo offline.
Sites / Downloads

* Web: https://bibliasagrada.or.app.br/
* Android (Play Store): https://play.google.com/store/apps/details?id=com.rafaelxulipa.simplebibleappmobile


Stack técnico

* Frontend web: React (Next.js opcional — confirmar se usa App Router)
* Mobile: React Native
* UI: TailwindCSS (ou CSS-in-JS conforme preferência)
* Controle de versão / CI: GitHub + GitHub Actions (sugerido)


Funcionalidades principais

* Navegação por livro, capítulo e versículo
* Busca por texto (por palavra/expressão)
* Suporte a múltiplas traduções (em progresso)
* Interface minimalista e responsiva
* Favoritos e marcações (planejado)
* Anotações pessoais (planejado)
* Modo offline (planejado)


Arquitetura (visão rápida)

1. Clients: Web (React) + Mobile (React Native)
2. Autenticação: Firebase Auth (email, Google, etc.)
3. Dados do usuário: Firestore (favoritos, anotações, configurações)
4. Conteúdo da Bíblia: arquivo JSON versionado / Firestore (read-only)
5. Hosting / Distribuição: Firebase Hosting (web) + Play Store / App Store (mobile)


Roadmap / Próximos passos

*  Finalizar suporte a múltiplas traduções
*  Implementar favoritos e anotações (sincronizados com Firebase)
*  Adicionar busca avançada (indexação / full-text)
*  Modo offline (caching por capítulo)
*  Internacionalização (i18n)
*  Testes E2E e integração contínua


Checklist de lançamento / PR template sugerido

*  Build local funcionando (web/mobile)
*  Testes unitários rodando
*  Revisão de performance (Lighthouse para web)
*  Configurações de Analytics ativadas (opcional)
*  Regras de segurança do Firestore revisadas


Como rodar local (exemplo)

Web: https://github.com/rafaelxulipa/simple-bible-app
https://github.com/rafaelxulipa/simple-bible-app

# Clonar o repositório
git clone git@github.com:rafaelxulipa/simple-bible-app.git

# instalar dependências
npm install
# rodar em dev
npm run dev
# build
npm run build
# start
npm run start


Mobile (React Native): https://github.com/rafaelxulipa/simple-bible-app-mobile
https://github.com/rafaelxulipa/simple-bible-app-mobile

# Clonar o repositório
git clone git@github.com:rafaelxulipa/simple-bible-app-mobile.git

# instalar dependências
npm install
# rodar em android
npxexpo run:android
# rodar em ios
npx expo run:ios




CI / CD (sugestão)

* GitHub Actions para:
    * rodar testes e lint em PRs
    * build automático e deploy no Firebase Hosting na branch main
    * pipeline de build para releases mobile (sentry / fastlane, se desejar)


Observações e recursos úteis

* Mantenha o conteúdo da Bíblia versionado em um JSON separado para facilitar atualizações
* Revisar regras de segurança do Firebase antes de liberar dados do usuário
* Considerar compactação dos assets de texto para melhorar loading


Contatos / Responsáveis

* Author / Dev: Otávio Rafael: https://github.com/rafaelxulipa

https://github.com/rafaelxulipa

Colaboradores

Débora Larissa: https://github.com/deboralarissadias
https://github.com/deboralarissadias

Michael Azvedo: https://github.com/Michael-azvdo
https://github.com/Michael-azvdo
