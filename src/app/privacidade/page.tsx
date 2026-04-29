import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — SmartPreço',
  description: 'Como o SmartPreço coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei 13.709/2018).',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-halo-gray-05">
      <header className="border-b border-halo-gray bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-halo-navy text-halo-orange text-sm font-extrabold">
              SP
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-halo-navy">SmartPreço</span>
          </a>
          <a
            href="/login"
            className="text-sm font-medium text-halo-navy-60 hover:text-halo-navy transition-colors"
          >
            Entrar →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-halo-navy mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-halo-navy-40 mb-10">
          Última atualização: abril de 2026 · Em conformidade com a LGPD (Lei 13.709/2018)
        </p>

        <div className="space-y-10 text-sm text-halo-navy leading-relaxed">

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">1. Controlador dos Dados</h2>
            <p>
              O controlador dos seus dados pessoais é <strong>Pedro Emilio Ferreira</strong>,
              responsável pelo produto SmartPreço. Para exercer seus direitos ou esclarecer dúvidas,
              entre em contato pelo email:{' '}
              <a
                href="mailto:privacidade@smartpreco.app"
                className="text-halo-navy font-medium underline hover:opacity-70"
              >
                privacidade@smartpreco.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">2. Dados Coletados</h2>
            <p className="mb-3">Coletamos apenas os dados necessários para a prestação do serviço:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Endereço de email</strong> — fornecido voluntariamente ao solicitar acesso ou
                ao usar a calculadora gratuita.
              </li>
              <li>
                <strong>Dados de uso anônimos</strong> — eventos do funil (ex.: cálculo iniciado,
                resultado exibido) sem identificação pessoal.
              </li>
              <li>
                <strong>Dados técnicos indiretos</strong> — endereço IP (anonimizado), tipo de
                navegador e referenciador da visita, coletados automaticamente pelo servidor.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Não coletamos</strong> CPF, telefone, dados bancários ou qualquer informação
              sensível nos termos do art. 5º, II, LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">3. Finalidade do Tratamento</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enviar o link de acesso ao produto mediante solicitação.</li>
              <li>Enviar comunicações sobre novidades de precificação no Mercado Livre (apenas se você optou por recebê-las).</li>
              <li>Melhorar o produto com base em dados agregados e anônimos de uso.</li>
              <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">4. Base Legal</h2>
            <p>
              O tratamento do seu email baseia-se no{' '}
              <strong>consentimento</strong> (art. 7º, I, LGPD), prestado ao marcar a caixa de
              aceite no formulário de captura. Você pode revogar esse consentimento a qualquer
              momento — veja a Seção 6.
            </p>
            <p className="mt-3">
              O tratamento de dados técnicos indiretos baseia-se no{' '}
              <strong>legítimo interesse</strong> (art. 7º, IX, LGPD) para garantir a segurança e
              o funcionamento do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">5. Retenção dos Dados</h2>
            <p>
              Seus dados são retidos pelo tempo necessário para a finalidade coletada ou até a
              revogação do consentimento. Após solicitação de exclusão, removemos seus dados em
              até <strong>30 dias</strong>, salvo obrigação legal de retenção.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">6. Seus Direitos (LGPD Art. 18)</h2>
            <p className="mb-3">Você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Confirmar</strong> se tratamos seus dados.</li>
              <li><strong>Acessar</strong> os dados que mantemos sobre você.</li>
              <li><strong>Corrigir</strong> dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Excluir</strong> dados desnecessários ou tratados em desconformidade.</li>
              <li><strong>Portabilidade</strong> dos seus dados a outro fornecedor.</li>
              <li><strong>Revogar o consentimento</strong> a qualquer momento, sem prejuízo ao tratamento realizado anteriormente.</li>
              <li><strong>Opor-se</strong> ao tratamento em caso de descumprimento da LGPD.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer desses direitos, envie email para{' '}
              <a
                href="mailto:privacidade@smartpreco.app"
                className="text-halo-navy font-medium underline hover:opacity-70"
              >
                privacidade@smartpreco.app
              </a>
              . Respondemos em até <strong>15 dias úteis</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">7. Compartilhamento de Dados</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.
              Utilizamos os seguintes prestadores de serviço, sujeitos a suas próprias políticas de
              privacidade:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Supabase</strong> — banco de dados (hospedagem nos EUA com SCCs aplicáveis).</li>
              <li><strong>Vercel</strong> — hospedagem da aplicação (EUA).</li>
              <li><strong>Sentry</strong> — monitoramento de erros (sem PII deliberada).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">8. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados: comunicação
              exclusivamente via HTTPS/TLS, acesso ao banco de dados restrito via Row-Level Security
              (RLS), e chaves de serviço nunca expostas ao cliente.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">9. Cookies e Rastreamento</h2>
            <p>
              Utilizamos cookies de sessão essenciais para o funcionamento do produto (autenticação).
              Não utilizamos cookies de rastreamento de terceiros para publicidade. Eventos de uso
              são coletados de forma agregada via Vercel Analytics, sem identificação individual.
            </p>
          </section>

          <section>
            <h2 className="text-base font-extrabold text-halo-navy mb-3">10. Contato e DPO</h2>
            <p>
              Dúvidas, solicitações ou reclamações relacionadas a privacidade devem ser enviadas para:{' '}
              <a
                href="mailto:privacidade@smartpreco.app"
                className="text-halo-navy font-medium underline hover:opacity-70"
              >
                privacidade@smartpreco.app
              </a>
              . Em caso de não resolução, você pode acionar a{' '}
              <strong>ANPD (Autoridade Nacional de Proteção de Dados)</strong> em{' '}
              <a
                href="https://www.gov.br/anpd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-halo-navy font-medium underline hover:opacity-70"
              >
                www.gov.br/anpd
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      <footer className="mt-12 border-t border-halo-gray bg-white py-6">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-halo-navy-40">
          SmartPreço · Versão provisória sujeita a revisão jurídica ·{' '}
          <a href="/calculadora-livre" className="underline hover:text-halo-navy">
            Voltar à calculadora
          </a>
        </div>
      </footer>
    </div>
  )
}
