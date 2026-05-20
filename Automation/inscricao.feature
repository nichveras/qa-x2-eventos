# language: pt

Funcionalidade: Gerenciamento de Inscrições para Eventos
  Como organizador de eventos da X2 Eventos
  Preciso adicionar participantes e gerenciar a lista de inscritos
  Para manter o controle do número de participantes e garantir comunicação eficaz

  Contexto:
    Dado que o organizador está autenticado no sistema
    E está na página do evento "Workshop de Testes"

  # ---------------------------------------------------------------------------
  # AC1 + AC4 + AC5 — Inscrição bem-sucedida
  # ---------------------------------------------------------------------------

  @AC1 @AC4 @AC5 @happy-path
  Cenário: Inscrição bem-sucedida com todos os campos preenchidos
    Dado que o evento possui vagas disponíveis
    Quando ele preenche "Nome Completo" com "Ana da Silva"
    E preenche "E-mail" com "ana.silva@email.com"
    E preenche "Telefone com DDD" com "11987654321"
    E clica no botão "Inscrever"
    Então a mensagem "Inscrição realizada com sucesso!" é exibida
    E "Ana da Silva" aparece na lista de inscritos com o e-mail "ana.silva@email.com"
    E o formulário é limpo para nova inscrição
    E a contagem de vagas é decrementada em 1

  @AC1 @campo-opcional
  Cenário: Inscrição sem telefone deve ser permitida
    Dado que o evento possui vagas disponíveis
    Quando ele preenche "Nome Completo" com "Carlos Pereira"
    E preenche "E-mail" com "carlos.p@email.com"
    E deixa "Telefone com DDD" em branco
    E clica no botão "Inscrever"
    Então a inscrição é realizada com sucesso

  # ---------------------------------------------------------------------------
  # AC2 — Validação de campos
  # ---------------------------------------------------------------------------

  @AC2 @validacao
  Esquema do Cenário: Botão "Inscrever" desabilitado com campos obrigatórios incompletos
    Dado que o formulário de inscrição está visível
    Quando preenche "Nome Completo" com "<nome>"
    E preenche "E-mail" com "<email>"
    Então o botão "Inscrever" está "<estado>"

    Exemplos:
      | nome        | email           | estado       |
      |             |                 | desabilitado |
      | Ana Silva   |                 | desabilitado |
      |             | ana@email.com   | desabilitado |
      | Ana Silva   | ana@email.com   | habilitado   |

  @AC2 @negativo @validacao-email
  Esquema do Cenário: Rejeitar e-mails com formato inválido
    Dado que o formulário de inscrição está visível
    Quando preenche "Nome Completo" com "Teste"
    E preenche "E-mail" com "<email_invalido>"
    E tenta clicar em "Inscrever"
    Então uma mensagem de erro de formato de e-mail é exibida
    E a inscrição não é registrada

    Exemplos:
      | email_invalido       |
      | usuario@             |
      | @dominio.com         |
      | usuario              |
      | usuario@.com         |
      | usuario @email.com   |

  @AC2 @negativo @validacao-nome
  Esquema do Cenário: Validar caracteres permitidos no campo Nome
    Dado que o formulário de inscrição está visível
    Quando preenche "Nome Completo" com "<nome>"
    E preenche "E-mail" com "teste@email.com"
    E clica no botão "Inscrever"
    Então a inscrição "<resultado>"

    Exemplos:
      | nome              | resultado       |
      | Ana123            | não é realizada |
      | Ana#@!            | não é realizada |
      |                   | não é realizada |
      | Ângela Müller     | é realizada     |
      | Ana da Silva      | é realizada     |
      | José Álvarez      | é realizada     |

  # ---------------------------------------------------------------------------
  # AC3 — Limite de vagas
  # ---------------------------------------------------------------------------

  @AC3 @negativo @limite-vagas
  Cenário: Bloquear inscrição quando evento está com vagas esgotadas
    Dado que o evento "Workshop de Testes" está com 50 de 50 vagas preenchidas
    Quando o organizador tenta inscrever "João Novo" com "joao@email.com"
    Então a mensagem "Vagas esgotadas!" é exibida ao usuário
    E a inscrição não é registrada no sistema
    E a contagem de vagas permanece em 0

  @AC3 @boundary
  Cenário: Inscrição bem-sucedida na última vaga disponível
    Dado que o evento possui exatamente 1 vaga disponível
    Quando o organizador inscreve "Maria Souza" com "maria@email.com"
    Então a inscrição é realizada com sucesso
    E o evento exibe "Vagas: 0/50"
    E qualquer nova tentativa exibe "Vagas esgotadas!"

  @AC3 @boundary @concorrencia
  Cenário: Race condition - duas inscrições simultâneas na última vaga
    Dado que o evento possui exatamente 1 vaga disponível
    Quando dois organizadores tentam inscrever participantes ao mesmo tempo
    Então apenas uma inscrição é registrada com sucesso
    E a outra recebe a mensagem "Vagas esgotadas!"
    E o sistema não registra overbooking

  # ---------------------------------------------------------------------------
  # AC7 — Remoção de participante
  # ---------------------------------------------------------------------------

  @AC7 @remocao
  Cenário: Remover inscrito atualiza lista e contador de vagas
    Dado que "Carlos Pereira" está inscrito no evento com "carlos.p@email.com"
    E o evento tem 47 vagas disponíveis de 50
    Quando o organizador clica em "Remover" ao lado de "Carlos Pereira"
    Então "Carlos Pereira" não aparece mais na lista de inscritos
    E o evento passa a ter 48 vagas disponíveis de 50

  @AC7 @remocao @todos
  Cenário: Remover todos os inscritos restaura total de vagas
    Dado que o evento possui 3 inscritos e 47 vagas disponíveis de 50
    Quando o organizador remove todos os inscritos um a um
    Então a lista de inscritos está vazia
    E o evento exibe "Vagas: 50/50"
