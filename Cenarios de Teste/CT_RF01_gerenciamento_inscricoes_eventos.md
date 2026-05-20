# Cenários de Teste — Gerenciamento de Inscrições para Eventos

## Cenário 01: Inscrição de participantes no evento.

### Caso de Teste 01: Inscrição bem-sucedida com todos os campos preenchidos.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT01 | A inscrição deve ser realizada com sucesso quando todos os campos obrigatórios forem preenchidos corretamente. |

| **Pré-condições** |
| :---------------- |
| O evento deve possuir vagas disponíveis. |

| **Passos** |
| :--------- |
| **DADO** que o evento possui vagas disponíveis |
| **QUANDO** o organizador preenche Nome, E-mail e Telefone |
| **E** clica no botão "Inscrever" |
| **ENTÃO** a mensagem de sucesso é exibida na tela |
| **E** o formulário é limpo para nova inscrição |
| **E** o participante aparece na lista de inscritos |
| **E** a contagem de vagas é decrementada em 1 |

| **Critérios de aceitação** |
| :------------------------- |
| O participante deve ser cadastrado corretamente e a contagem de vagas atualizada. |

---

### Caso de Teste 02: Inscrição sem telefone deve ser aceita.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT02 | O sistema deve permitir inscrição sem preenchimento do telefone. |

| **Pré-condições** |
| :---------------- |
| O formulário de inscrição deve estar visível. |

| **Passos** |
| :--------- |
| **DADO** que o formulário de inscrição está visível |
| **QUANDO** o organizador preenche apenas Nome e E-mail |
| **E** clica no botão "Inscrever" |
| **ENTÃO** a inscrição é realizada com sucesso |

| **Critérios de aceitação** |
| :------------------------- |
| O telefone deve ser tratado como campo opcional. |

---

### Caso de Teste 03: Botão "Inscrever" desabilitado com campos obrigatórios vazios.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT03 | O botão "Inscrever" deve permanecer desabilitado enquanto os campos obrigatórios não forem preenchidos corretamente. |

| **Pré-condições** |
| :---------------- |
| O formulário de inscrição deve estar disponível para preenchimento. |

| **Passos** |
| :--------- |
| **DADO** que o formulário de inscrição está visível |
| **QUANDO** nenhum campo é preenchido |
| **ENTÃO** o botão "Inscrever" deve permanecer desabilitado |
| **QUANDO** apenas o campo Nome é preenchido |
| **ENTÃO** o botão "Inscrever" deve permanecer desabilitado |
| **QUANDO** apenas o campo E-mail é preenchido |
| **ENTÃO** o botão "Inscrever" deve permanecer desabilitado |
| **QUANDO** Nome e E-mail válidos são preenchidos |
| **ENTÃO** o botão "Inscrever" deve ser habilitado |

| **Critérios de aceitação** |
| :------------------------- |
| O botão deve ser habilitado apenas quando os campos obrigatórios forem preenchidos corretamente. |

---

### Caso de Teste 04: Rejeitar e-mails com formato inválido.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT04 | O sistema deve impedir inscrições com e-mails inválidos. |

| **Pré-condições** |
| :---------------- |
| O formulário de inscrição deve estar disponível. |

| **Passos** |
| :--------- |
| **DADO** que o formulário de inscrição está visível |
| **QUANDO** o organizador informa um e-mail inválido |
| **ENTÃO** a inscrição não deve ser realizada |
| **E** uma mensagem de erro de validação deve ser exibida |

| **Exemplos de e-mails inválidos** |
| :-------------------------------- |
| usuario@ — sem domínio |
| @dominio.com — sem usuário |
| usuario — sem @ e domínio |
| usuario@.com — domínio inválido |
| usuario @email.com — espaço no meio |

| **Critérios de aceitação** |
| :------------------------- |
| O sistema deve bloquear inscrições com formatos inválidos de e-mail. |

---

### Caso de Teste 05: Bloquear inscrição quando o evento estiver lotado.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT05 | O sistema deve impedir novas inscrições quando todas as vagas estiverem preenchidas. |

| **Pré-condições** |
| :---------------- |
| O evento deve estar com todas as vagas preenchidas. |

| **Passos** |
| :--------- |
| **DADO** que o evento está lotado |
| **QUANDO** o organizador tenta inscrever um novo participante |
| **ENTÃO** a mensagem "Vagas esgotadas!" deve ser exibida |
| **E** a inscrição não deve ser registrada no sistema |

| **Critérios de aceitação** |
| :------------------------- |
| O sistema não deve permitir overbooking de participantes. |

---

### Caso de Teste 06: Inscrição na última vaga disponível.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT06 | O sistema deve permitir apenas uma inscrição quando existir exatamente uma vaga restante. |

| **Pré-condições** |
| :---------------- |
| O evento deve possuir exatamente 1 vaga disponível. |

| **Passos** |
| :--------- |
| **DADO** que o evento possui exatamente 1 vaga disponível |
| **QUANDO** o primeiro participante realiza a inscrição |
| **ENTÃO** a inscrição deve ser realizada com sucesso |
| **E** a contagem de vagas deve chegar a 0 |
| **QUANDO** uma nova tentativa de inscrição é realizada |
| **ENTÃO** a mensagem "Vagas esgotadas!" deve ser exibida |

| **Critérios de aceitação** |
| :------------------------- |
| Apenas uma inscrição deve ser permitida na última vaga disponível. |

---

### Caso de Teste 07: Remover inscrito atualiza lista e contador de vagas.

| ID       | Descrição |
| :------- | :--------- |
| C01-CT07 | O sistema deve remover corretamente um participante da lista de inscritos e atualizar a quantidade de vagas disponíveis. |

| **Pré-condições** |
| :---------------- |
| Deve existir ao menos um participante inscrito no evento. |

| **Passos** |
| :--------- |
| **DADO** que um participante está inscrito no evento |
| **QUANDO** o organizador clica em "Remover" ao lado do participante |
| **ENTÃO** o participante não deve aparecer mais na lista |
| **E** a quantidade de vagas disponíveis deve aumentar em 1 |

| **Critérios de aceitação** |
| :------------------------- |
| A remoção deve atualizar corretamente a lista de inscritos e o contador de vagas. |