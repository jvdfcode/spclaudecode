export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Painel esquerdo — marca (apenas desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl">
              💰
            </div>
            <span className="text-2xl font-bold tracking-tight">SmartPreço</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Precifique com inteligência.<br />Venda com margem real.
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md">
            Calcule o custo real de cada produto, simule cenários, compare com o mercado e tome a decisão certa — tudo em uma tela.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: '✅', text: 'Taxas do Mercado Livre calculadas automaticamente' },
            { icon: '📊', text: 'Simulador de cenários de preço em tempo real' },
            { icon: '🏪', text: 'Comparação com anúncios reais da concorrência' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-blue-100">
              <span>{icon}</span>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo só aparece em mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm">
              💰
            </div>
            <span className="text-xl font-bold text-gray-900">SmartPreço</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
