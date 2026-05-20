# QA Challenge - Gerenciamento de Inscrições para Eventos

> Análise de qualidade completa para o sistema de gerenciamento de participantes da **X2 Eventos**, incluindo checklist de testes, cenários Gherkin e automação com Playwright.

---

## 📋 Sobre o desafio

A X2 Eventos precisava de um sistema interno para substituir o processo manual (planilhas e e-mails) de gestão de inscrições em workshops corporativos. O objetivo foi analisar os requisitos e garantir a qualidade da funcionalidade de **inscrição e gerenciamento de participantes**.

**História de usuário:**
> Como organizador de eventos, preciso adicionar novos participantes e gerenciar a lista de inscritos, para manter o controle do número de participantes e garantir uma comunicação eficaz.

---

## ✅ Critérios de aceite cobertos

| ID | Critério | Cenário | Tipo | Prioridade |
|---|---|---|---|---|
| AC1 | Cadastro | Inscrição com sucesso | Caminho feliz | Alta |
| AC1 | Cadastro | Cadastro sem telefone | Funcional | Média |
| AC2 | Validação | Campos obrigatórios vazios | Negativo | Alta |
| AC2 | Validação | E-mail inválido | Negativo | Alta |
| AC2 | Validação | Nome com caracteres inválidos | Negativo | Média |
| AC3 | Limite de vagas | Evento lotado | Limite | Alta |
| AC3 | Limite de vagas | Última vaga disponível | Limite | Alta |
| AC3 | Concorrência | Duas inscrições simultâneas | Concorrência | Alta |
| AC4 | Feedback | Mensagem de sucesso | Funcional | Média |
| AC5 | Lista de inscritos | Participante aparece na lista | Funcional | Alta |
| AC5 | Lista de inscritos | Atualização da contagem de vagas | Funcional | Alta |
| AC7 | Remoção | Remover participante | Funcional | Alta |
| AC7 | Remoção | Restaurar vagas após remoção | Funcional | Média |
| SEG1 | Segurança | Impedir scripts no campo nome (XSS) | Segurança | Alta |
| NEG1 | Integridade | Impedir inscrição duplicada | Negativo | Alta |
| NEG2 | Integridade | Evitar múltiplos cliques no botão Inscrever | Negativo | Média |
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

1. **Confirmação antes de remover** - evitar exclusão acidental de inscrito
2. **Feedback do e-mail enviado** - exibir status do envio ao organizador
3. **Busca e ordenação na lista** - facilitar gestão de eventos grandes
4. **Máscara no campo Telefone** - formato (XX) XXXXX-XXXX com teclado numérico
5. **Prevenção de duplicatas** - validar e-mail único por evento

---

## ❓ Perguntas levantadas ao time

1. **O sistema deve permitir participantes com o mesmo nome?**
2. **E-mails duplicados devem ser bloqueados?**
3. **Existe limite de caracteres para nome e telefone?**
4. **O que ocorre se o envio do e-mail de confirmação falhar?**
5. **O sistema deve atualizar vagas em tempo real para múltiplos organizadores?**
6. **O botão “Inscrever” deve possuir proteção contra múltiplos cliques?**
7. **Existe necessidade de auditoria/log de remoção de participantes?**
8. **Como o sistema deve tratar concorrência entre inscrições simultâneas?**
---

## 🛠️ Tecnologia utilizada

| Tecnologia | Objetivo |
|---|---|
| Playwright | Automação E2E |
| TypeScript | Linguagem da automação |
| Page Object Model | Organização e manutenção dos testes |
| GitHub Actions | Execução contínua dos testes |
| Faker | Geração de massa dinâmica |

