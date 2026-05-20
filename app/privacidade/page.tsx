import type { Metadata } from "next"
import Link from "next/link"
import { CelestialBackground } from "@/components/celestial-background"
import { Shield, Database, Eye, Smartphone, Trash2, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidade — Bíblia Sagrada",
  description: "Entenda como o aplicativo Bíblia Sagrada trata seus dados. Nenhuma informação é enviada para servidores.",
}

const sections = [
  {
    icon: Shield,
    title: "Nossa filosofia de privacidade",
    body: "O Bíblia Sagrada foi construído com privacidade por padrão. Não coletamos, transmitimos nem armazenamos qualquer dado pessoal em servidores externos. Toda a informação que você fornece ao aplicativo permanece exclusivamente no seu dispositivo.",
  },
  {
    icon: Smartphone,
    title: "O que é armazenado localmente",
    body: null,
    list: [
      { label: "Nome e Igreja", desc: "Informados voluntariamente no primeiro acesso, usados apenas para personalizar a saudação na tela inicial." },
      { label: "Versículos favoritos", desc: "Lista de versículos marcados com ❤️, guardada para consulta futura." },
      { label: "Progresso de leitura", desc: "O livro e capítulo onde você parou na leitura corrida da Bíblia." },
      { label: "Preferências", desc: "Tema (claro/escuro), tamanho de fonte e versão da Bíblia selecionada." },
    ],
  },
  {
    icon: Database,
    title: "O que NÃO fazemos",
    body: null,
    list: [
      { label: "Sem conta de usuário", desc: "Não é necessário criar conta, fornecer e-mail ou senha." },
      { label: "Sem rastreamento", desc: "Não usamos cookies de rastreamento, pixels de anúncio ou ferramentas de analytics que identifiquem você." },
      { label: "Sem envio de dados", desc: "Nenhuma informação digitada no app é enviada para qualquer servidor." },
      { label: "Sem anúncios personalizados", desc: "Não vendemos nem compartilhamos dados com terceiros para fins publicitários." },
    ],
  },
  {
    icon: Eye,
    title: "Conteúdo da Bíblia",
    body: "Os textos bíblicos (NVI, ACF e AA) são carregados diretamente do seu dispositivo após o primeiro acesso. Não há chamadas para APIs externas para exibir os versículos.",
  },
  {
    icon: Trash2,
    title: "Como apagar seus dados",
    body: "Para remover todos os dados armazenados, acesse as Configurações do aplicativo e toque em \"Redefinir\". Isso apaga nome, igreja, favoritos e progresso de leitura. Alternativamente, você pode limpar os dados do site nas configurações do seu navegador.",
  },
]

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <CelestialBackground />

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-3">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                Política de Privacidade
              </h1>
              <p className="text-white/80 text-sm mt-0.5 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">Bíblia Sagrada · Atualizada em maio de 2026</p>
            </div>
          </div>

          {/* Destaque principal */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
            <div className="p-6 sm:p-8 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">Seus dados ficam só no seu dispositivo</p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Este aplicativo não possui servidor back-end, não cria contas de usuário e não transmite nenhuma informação para a internet. Tudo que você configura é salvo localmente via <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> do navegador.
                </p>
              </div>
            </div>
          </div>

          {/* Seções */}
          {sections.map((s, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-sky-600" />
                  </div>
                  <h2 className="font-bold text-gray-800 text-base">{s.title}</h2>
                </div>
                {s.body && <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>}
                {s.list && (
                  <ul className="space-y-3">
                    {s.list.map((item, j) => (
                      <li key={j} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                        <div>
                          <p className="text-gray-800 text-sm font-semibold">{item.label}</p>
                          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {/* Rodapé */}
          <div className="text-center space-y-3 pb-8">
            <p className="text-white/60 text-xs">
              Dúvidas? Entre em contato: <span className="text-white/80">contato@bibliasagrada.app</span>
            </p>
            <Link href="/"
              className="inline-block bg-white/20 hover:bg-white/30 text-white text-sm px-6 py-2 rounded-full backdrop-blur-sm border border-white/30 transition-colors">
              ← Voltar ao app
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
