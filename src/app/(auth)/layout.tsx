const features = [
  'Taxas do Mercado Livre calculadas automaticamente',
  'Simulador de cenários de preço em tempo real',
  'Comparação com anúncios reais da concorrência',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root">
      {/* Painel esquerdo — marca (desktop) */}
      <div className="auth-brand">
        <div className="auth-brand-top-bar" />

        <div className="auth-logo-mark">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0a0f2e' }}>
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="auth-logo-name">SmartPreço</span>
        </div>

        <div className="auth-brand-headline">
          <h1>
            Precifique com <em>inteligência.</em><br />
            Venda com margem real.
          </h1>
          <p>
            Calcule o custo real de cada produto, simule cenários, compare com o mercado
            e tome a decisão certa — tudo em uma tela.
          </p>
        </div>

        <div className="auth-brand-features">
          {features.map((text) => (
            <div key={text} className="auth-brand-feature">
              <div className="auth-brand-feature-dot" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="auth-form-panel">
        {/* Logo mobile */}
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, color: '#0a0f2e' }}>
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="auth-mobile-logo-name">SmartPreço</span>
        </div>
        {children}
      </div>
    </div>
  )
}
