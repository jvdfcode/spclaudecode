# Rony Meisler — Auditoria Brand-First do plano de análise

> "Comum é fácil. Relevante é difícil. Plano que não fala de marca aceita que o produto vire commodity."

## Veredito
**NEEDS WORK**

## 3 Fortalezas (do plano)

1. **Posicionamento declarado existe e tem espinha dorsal.** O `posicionamento.md` escolheu Liderança em Produto e disse NÃO a Excelência Operacional e NÃO a Intimidade com Cliente. Isso é raro — a maioria dos fundadores quer ser tudo pra todo mundo. Escolher uma porta e trancar as outras é gesto de marca, não de produto.

2. **Anti-posicionamentos são explícitos.** A frase "SmartPreço não é McDonald's" mostra consciência de que não competir em volume é uma decisão estratégica. Toda marca forte é definida pelo que recusa. Isso sobrevive.

3. **Loss Aversion como headline é instinto correto.** A decisão de comunicar "quanto você está perdendo" em vez de "ferramenta completa de gestão" é a única fagulha de narrativa real no plano inteiro. Dor concreta > benefício abstrato. Finch acertou aqui.

## 5 Fraquezas (cegueira de marca)

1. **Bloco M ignora narrativa do produto — só fala de features e pricing.** O plano inteiro — brief, PRD, EPIC-MKT-001, posicionamento.md — descreve o SmartPreço como "motor de decisão de preço mais preciso para o Mercado Livre Brasil". Isso é um feature claim, não uma narrativa. Nenhum documento pergunta: qual história o SmartPreço conta? Qual é a transformação que o vendedor vive ao usar? Na Reserva, a gente não vendia roupa — vendia a história do cara que veste. SmartPreço não vende calculadora — deveria vender a história do vendedor que parou de perder dinheiro sem saber. Mas essa história não está escrita em lugar nenhum. O `posicionamento.md` diz `"o motor de decisão de preço mais preciso"` — isso é especificação técnica, não posicionamento de marca. Nenhum vendedor do Méier acorda de manhã e fala "preciso de um motor de decisão mais preciso". Ele fala "preciso parar de vender no prejuízo".

2. **Não mapeia ritual de uso.** O plano assume que o vendedor vai abrir o SmartPreço, mas não documenta QUANDO, POR QUE e COM QUE FREQUÊNCIA. O brief diz `"tempo para primeira decisão de preço: < 5 minutos"` — isso é métrica de onboarding, não ritual. Ritual é: todo domingo à noite o Pedro do Méier abre o SmartPreço antes de reajustar os preços da semana, porque segunda-feira o ML atualiza ranking e ele precisa estar posicionado. Sem ritual documentado, o produto é ferramenta de uso único. E ferramenta de uso único não sustenta assinatura de R$39-59/mês. A Central de SKUs tenta resolver retenção, mas retenção sem ritual é feature técnica, não hábito.

3. **Não define tribo — só define persona genérica.** O brief descreve `"Pessoa física ou ME/EPP vendendo no ML como atividade principal ou complementar, 10-500 SKUs ativos, faturamento R$5K-R$100K/mês"`. Isso é segmentação demográfica, não tribo. Tribo é: o Pedro, 34 anos, Méier, RJ, vende capinha de celular no ML, acorda 6h pra embalar pedido, não tem funcionário, usa Excel com célula amarela pra marcar o que dá lucro, e a esposa dele que cobra "quanto a gente ganhou esse mês?" e ele não sabe responder. ESSE é o cara. Tribo tem nome, tem rosto, tem vergonha, tem ambição. "Vendedor com 5+ SKUs" não é tribo — é filtro de CRM. Sem tribo, a marca não tem embaixador. Sem embaixador, a marca não tem voz.

4. **Anti-comoditização não existe.** O plano não responde a pergunta mais perigosa: se o Mercado Livre lança uma calculadora oficial de taxas amanhã (e eles podem — já têm dados de todos os vendedores), SmartPreço sobrevive pelo quê? O `posicionamento.md` diz que o diferencial é `"scraping de anúncios reais ML + cálculo de taxas por tipo de anúncio"` — isso é vantagem técnica, não vantagem de marca. Vantagem técnica é copiável em 90 dias. Vantagem de marca leva anos pra construir e não se copia. Reserva sobreviveu a dezenas de marcas que copiaram bermuda de sarja porque a marca era maior que o produto. SmartPreço precisa ser maior que a calculadora. Hoje não é.

5. **Pricing sem narrativa é preço de commodity.** O plano propõe `"R$39/49/59 em A/B test"` para o Pro. Esse é preço de SaaS comum — preço de quem não tem história pra contar. R$49/mês é o que cobra qualquer ferramenta de gestão sem diferencial. A pergunta certa não é "quanto o mercado paga por SaaS de pricing" — é "quanto vale dormir tranquilo sabendo que nenhum dos seus 50 SKUs está vendendo no prejuízo". Se a narrativa é forte, R$99 é barato. Se não tem narrativa, R$29 é caro. O A/B test de preço sem A/B test de narrativa mede a coisa errada.

## 3 Mudanças (brand-first) que devem entrar

1. **ADICIONAR teste de narrativa no Bloco I.** Antes de testar preço, testar história. Nas 10 entrevistas ICP (MKT-001-2), incluir: "me conta a última vez que você descobriu que estava vendendo no prejuízo — o que sentiu?" Essa resposta é a narrativa do produto. Não é o fundador que inventa a história — é o cliente que conta.

2. **ADICIONAR mapeamento de ritual de uso.** Nas mesmas entrevistas, perguntar: "quando você reajusta preços? com que frequência? o que dispara essa decisão?" Se o ritual natural do vendedor é "todo domingo à noite antes da semana começar", o SmartPreço precisa ser o app que ele abre domingo à noite. Se não existe ritual, o produto precisa CRIAR um — e isso muda roadmap, muda notificação, muda tudo.

3. **EXIGIR análise anti-comoditização antes de pricing.** Adicionar ao posicionamento.md uma seção explícita: "Se ML lança calculadora oficial, SmartPreço sobrevive porque ___." Se a resposta é "porque nosso cálculo é mais preciso" — parabéns, você tem 6 meses até ser irrelevante. Se a resposta é "porque somos a marca que a tribo dos vendedores de marketplace confia pra tomar decisão de preço" — aí você tem categoria.

## Tese central de marca (questionada)

- **Atual:** "motor de decisão de preço mais preciso" (feature claim puro)
- **Brand-First:** "O SmartPreço é o copiloto financeiro do vendedor ML que não aceita mais vender no escuro. Todo domingo à noite, antes da semana começar, ele abre o app, revisa seus SKUs e sai com a certeza de que cada produto no portfólio está pagando o suor dele."
- **Risco:** sem narrativa, o primeiro concorrente que construir marca nesse espaço — mesmo com motor pior — ganha a categoria. Quem define a categoria define o premium. Quem chega depois compete em preço. E competir em preço é exatamente o problema que o SmartPreço diz resolver.

## Conclusão executiva

O plano de análise de viabilidade é tecnicamente sólido e comercialmente lúcido — o roundtable anterior já forçou a pergunta "quem paga?", e o Bloco I responde com entrevistas, concorrência e pricing. Mas é um plano que trata marca como consequência de produto, quando deveria tratar marca como pré-requisito de categoria. Sem narrativa, sem ritual, sem tribo e sem tese de anti-comoditização, o SmartPreço está construindo uma ferramenta comum quando poderia estar construindo uma marca relevante. E comum morre no preço. Relevante morre só quando para de ser verdadeiro.
