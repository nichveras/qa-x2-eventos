# QA Challenge — Gerenciamento de Inscrições para Eventos

> Análise de qualidade completa para o sistema de gerenciamento de participantes da **X2 Eventos**, incluindo checklist de testes, cenários Gherkin e automação com Playwright.

---

## 📋 Sobre o desafio

A X2 Eventos precisava de um sistema interno para substituir o processo manual (planilhas e e-mails) de gestão de inscrições em workshops corporativos. O objetivo foi analisar os requisitos e garantir a qualidade da funcionalidade de **inscrição e gerenciamento de participantes**.

**História de usuário:**
> Como organizador de eventos, preciso adicionar novos participantes e gerenciar a lista de inscritos, para manter o controle do número de participantes e garantir uma comunicação eficaz.

---

## ✅ Critérios de aceite cobertos

| ID  | Critério                          | Cobertura         |
|-----|-----------------------------------|-------------------|
| AC1 | Formulário de inscrição           | ✅ Happy path + negativos |
| AC2 | Validação dos campos              | ✅ E-mail, nome, obrigatórios |
| AC3 | Limite de vagas                   | ✅ Lotado + boundary test |
| AC4 | Confirmação de inscrição          | ✅ Mensagem + reset do form |
| AC5 | Atualização da lista em tempo real| ✅ Verificação imediata |
| AC6 | E-mail de confirmação             | ⚠️ Dependente de mock de SMTP |
| AC7 | Remoção de participante           | ✅ Remoção + contagem de vagas |

---

## 🗂️ Estrutura do repositório

```
qa-x2-eventos/
├── docs/
│   └── relatorio-qa.pdf        # Análise completa (checklist, perguntas, melhorias UX)
├── features/
│   └── inscricao.feature       # Cenários Gherkin em português
├── tests/
│   └── inscricao.spec.ts       # Testes automatizados (Playwright)
├── pages/
│   └── EventPage.ts            # Page Object Model
├── playwright.config.ts
└── package.json
```

---

## 🚀 Como executar os testes

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
git clone https://github.com/seu-usuario/qa-x2-eventos.git
cd qa-x2-eventos
npm install
npx playwright install
```

### Rodando os testes

```bash
# Todos os testes
npx playwright test

# Com interface visual
npx playwright test --ui

# Um arquivo específico
npx playwright test tests/inscricao.spec.ts

# Com relatório HTML
npx playwright test --reporter=html
npx playwright show-report
```

---

## 🧪 Cenários cobertos

### Happy path
- Inscrição com todos os campos preenchidos
- Inscrição sem telefone (campo opcional)
- Remoção de participante com atualização de vagas

### Validações e negativos
- Botão desabilitado sem campos obrigatórios
- E-mails com formato inválido (5 variações)
- Nome com números ou caracteres especiais
- Nome com apenas espaços em branco

### Casos de limite (boundary)
- Inscrição quando restam exatamente 0 vagas → "Vagas esgotadas!"
- Inscrição na última vaga disponível
- Race condition: duas inscrições simultâneas na última vaga

---

## 💡 Melhorias UX/UI propostas

1. **Confirmação antes de remover** — evitar exclusão acidental de inscrito
2. **Feedback do e-mail enviado** — exibir status do envio ao organizador
3. **Busca e ordenação na lista** — facilitar gestão de eventos grandes
4. **Máscara no campo Telefone** — formato (XX) XXXXX-XXXX com teclado numérico
5. **Prevenção de duplicatas** — validar e-mail único por evento

---

## ❓ Perguntas levantadas ao time

- O que acontece se o envio do e-mail de confirmação falhar?
- É possível o mesmo e-mail se inscrever duas vezes no mesmo evento?
- O limite de vagas é fixo (50) ou configurável por evento?
- Quem tem permissão para remover um inscrito?
- Há validação de formato/DDD no campo Telefone?

---

## 🛠️ Stack utilizada

- **Playwright** — automação de testes E2E
- **TypeScript** — tipagem e manutenibilidade
- **Page Object Model** — organização e reúso de código
- **Gherkin** — documentação de cenários em linguagem natural
