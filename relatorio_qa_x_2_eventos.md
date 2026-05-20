# Relatorio de Analise QA - X2 Eventos

## Objetivo

Avaliar a funcionalidade de gerenciamento de inscricoes da plataforma **X2 Eventos**, garantindo:
- controle correto de vagas;
- integridade das inscricoes;
- validacoes de formulario;
- experiencia do usuario;
- prevencao de erros operacionais;
- confiabilidade do sistema em cenários críticos.

---

# Escopo Avaliado

A análise cobre os seguintes fluxos:

- Cadastro de participantes
- Validação de campos obrigatórios
- Controle de limite de vagas
- Atualização da lista de inscritos
- Remoção de participantes
- Tratamento de cenários negativos
- Concorrência de inscrições
- Experiência do usuário
- Integridade dos dados

---

# Estratégia de Testes

A estrategia foi baseada em:
- testes funcionais;
- testes negativos;
- testes de limite (boundary);
- testes exploratórios;
- testes de concorrência;
- validações de UX;
- prevenção de inconsistências de negócio.

---

# Tecnologias Utilizadas

| Tecnologia | Objetivo |
|---|---|
| Playwright | Automação E2E |
| TypeScript | Linguagem da automação |
| Page Object Model | Organização e manutenção dos testes |
| GitHub Actions | Execução contínua dos testes |
| Faker | Geração de massa dinâmica |

---

# Checklist de Cobertura

| ID | Critério | Cenário | Tipo | Prioridade |
|---|---|---|---|---|
| AC1 | Cadastro | Inscrição com sucesso | Caminho feliz | Alta |
| AC1 | Cadastro | Cadastro sem telefone | Funcional | Média |
| AC2 | Validação | Campos obrigatórios vazios | Negativo | Alta |
| AC2 | Validação | E-mail inválido | Negativo | Alta |
| AC2 | Validação | Nome com caracteres inválidos | Negativo | Média |
| AC3 | Limite de vagas | Evento lotado | Boundary | Alta |
| AC3 | Limite de vagas | Última vaga disponível | Boundary | Alta |
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

# Cenários Críticos Avaliados

## 1. Controle de Overbooking

- o sistema deve bloquear inscrições quando o limite é atingido;
- a contagem de vagas não fica negativa;
- apenas uma inscrição é concluída em cenários concorrentes.

### Risco mitigado

Evitar inconsistência operacional e excesso de participantes.

---

## 2. Validação de Dados

- campos obrigatórios;
- formato de e-mail;
- caracteres inválidos no nome;
- campos vazios;
- espaços em branco.

### Risco mitigado

Evitar dados inconsistentes e problemas de comunicação.

---

# Testes Negativos

Os seguintes cenários negativos foram considerados:

- inscrição com e-mail inválido;
- nome contendo números;
- nome contendo caracteres especiais;
- tentativa de inscrição sem vagas disponíveis;
- tentativa de múltiplas inscrições simultâneas;
- formulário incompleto;
- tentativa de envio com apenas espaços em branco;
- tentativa de inscrição duplicada;
- tentativa de múltiplos cliques no botão de inscrição.

---

# Perguntas e Pontos de Alinhamento com Produto/PO

Durante a análise, foram identificados pontos que necessitam refinamento funcional:

1. O sistema deve permitir participantes com o mesmo nome?
2. E-mails duplicados devem ser bloqueados?
3. Existe limite de caracteres para nome e telefone?
4. O que ocorre se o envio do e-mail de confirmação falhar?
5. O sistema deve atualizar vagas em tempo real para múltiplos organizadores?
6. O botão “Inscrever” deve possuir proteção contra múltiplos cliques?
7. Existe necessidade de auditoria/log de remoção de participantes?
8. Como o sistema deve tratar concorrência entre inscrições simultâneas?

---

# Melhorias de UX/UI Recomendadas

## 1. Máscara para telefone

Aplicar máscara automática:

```text
(11) 98765-4321
```

### Benefícios

- melhora da experiência do usuário;
- redução de erros de digitação.

---

## 2. Feedback visual de carregamento

Adicionar estado de loading no botão “Inscrever”.

### Benefícios

- evita múltiplos cliques;
- melhora a percepção de resposta do sistema.

---

## 3. Validação inline

Exibir mensagens de erro abaixo dos campos.

### Benefícios

- feedback imediato;
- redução de retrabalho do usuário.

---

## 4. Atualização visual de vagas

Atualizar contador de vagas imediatamente após inscrição/remoção.

### Benefícios

- transparência operacional;
- melhor controle do evento.

---

# Melhorias Técnicas Recomendadas

## Backend

- validação transacional para evitar overbooking;
- proteção contra race condition;
- validação server-side de e-mail duplicado;
- sanitização de inputs contra XSS;
- logs de auditoria para remoções.

---

## Frontend

- bloqueio de múltiplos cliques;
- debounce em ações críticas;
- validação preventiva de formulário;
- tratamento visual de estados de erro.

---

# Conclusão

A funcionalidade apresenta requisitos importantes relacionados à:
- integridade operacional;
- concorrência;
- experiência do usuário;
- consistência de dados.

A estratégia de testes foi construída visando não apenas validar o fluxo principal, mas também explorar:
- cenários negativos;
- limites do sistema;
- falhas operacionais;
- concorrência;
- riscos de inconsistência.

Os testes automatizados foram estruturados utilizando:
- Playwright;
- TypeScript;
- Page Object Model;
- massa dinâmica;
- cenários parametrizados.

O objetivo foi garantir uma cobertura robusta, com foco em qualidade, estabilidade e confiabilidade da funcionalidade.
