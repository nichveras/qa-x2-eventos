import { test, expect } from '@playwright/test';
import { EventPage } from '../pages/EventPage';

const EVENT_ID        = 'workshop-testes';
const EVENT_LOTADO_ID = 'workshop-lotado';   // fixture: 50/50 vagas
const EVENT_1_VAGA_ID = 'workshop-ultima-vaga'; // fixture: 1 vaga restante

// =============================================================================
// AC1 + AC4 + AC5 — Inscrição e confirmação
// =============================================================================

test.describe('Inscrição de participantes (AC1, AC4, AC5)', () => {

  test('deve inscrever participante com todos os campos preenchidos', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);

    const vagasAntes = await ev.getVagasDisponiveis();

    await ev.inscreverParticipante('Ana da Silva', 'ana.silva@email.com', '11987654321');

    // AC4 — mensagem de sucesso
    await expect(ev.successMsg).toBeVisible();

    // AC4 — formulário limpo após inscrição
    await expect(ev.nomeInput).toBeEmpty();
    await expect(ev.emailInput).toBeEmpty();
    await expect(ev.telefoneInput).toBeEmpty();

    // AC5 — participante aparece na lista
    await expect(ev.participantsList).toContainText('Ana da Silva');
    await expect(ev.participantsList).toContainText('ana.silva@email.com');

    // AC5 — vagas decrementadas
    expect(await ev.getVagasDisponiveis()).toBe(vagasAntes - 1);
  });

  test('deve permitir inscrição sem telefone (campo opcional)', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);

    await ev.inscreverParticipante('Carlos Pereira', 'carlos.p@email.com');

    await expect(ev.successMsg).toBeVisible();
    await expect(ev.participantsList).toContainText('Carlos Pereira');
  });

  test('formulário deve reaparecer limpo para nova inscrição após sucesso', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);

    await ev.inscreverParticipante('Participante Um', 'um@email.com');
    await expect(ev.successMsg).toBeVisible();

    // formulário deve estar pronto para nova entrada
    await expect(ev.nomeInput).toBeEmpty();
    await expect(ev.emailInput).toBeEmpty();
    await expect(ev.inscreverBtn).toBeDisabled();
  });
});

// =============================================================================
// AC2 — Validação de campos
// =============================================================================

test.describe('Validação de campos (AC2)', () => {

  test('botão Inscrever deve estar desabilitado com formulário vazio', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);
    await expect(ev.inscreverBtn).toBeDisabled();
  });

  test('botão deve permanecer desabilitado com apenas nome preenchido', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);
    await ev.nomeInput.fill('Ana Silva');
    await expect(ev.inscreverBtn).toBeDisabled();
  });

  test('botão deve permanecer desabilitado com apenas e-mail preenchido', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);
    await ev.emailInput.fill('ana@email.com');
    await expect(ev.inscreverBtn).toBeDisabled();
  });

  test('botão deve ser habilitado com nome e e-mail válidos preenchidos', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);
    await ev.nomeInput.fill('Ana Silva');
    await ev.emailInput.fill('ana@email.com');
    await expect(ev.inscreverBtn).toBeEnabled();
  });

  const emailsInvalidos = [
    { valor: 'usuario@',          descricao: 'sem domínio' },
    { valor: '@dominio.com',      descricao: 'sem usuário' },
    { valor: 'usuario',           descricao: 'sem @ e domínio' },
    { valor: 'usuario@.com',      descricao: 'domínio inválido' },
    { valor: 'usuario @email.com',descricao: 'espaço no meio' },
  ];

  for (const { valor, descricao } of emailsInvalidos) {
    test(`deve rejeitar e-mail inválido: ${descricao} ("${valor}")`, async ({ page }) => {
      const ev = new EventPage(page);
      await ev.goto(EVENT_ID);
      await ev.nomeInput.fill('Teste');
      await ev.emailInput.fill(valor);
      await ev.inscreverBtn.click();
      await expect(ev.successMsg).not.toBeVisible();
      await expect(ev.emailErroMsg).toBeVisible();
    });
  }

  const casosNome = [
    { nome: 'Ana123',        aceito: false, motivo: 'contém números' },
    { nome: 'Ana#@!',        aceito: false, motivo: 'contém caracteres especiais' },
    { nome: '   ',           aceito: false, motivo: 'apenas espaços em branco' },
    { nome: 'Ângela Müller', aceito: true,  motivo: 'acentos e trema (válido)' },
    { nome: 'Ana da Silva',  aceito: true,  motivo: 'nome composto (válido)' },
    { nome: 'José Álvarez',  aceito: true,  motivo: 'acento e espaço (válido)' },
  ];

  for (const { nome, aceito, motivo } of casosNome) {
    test(`nome "${nome}" — ${motivo}`, async ({ page }) => {
      const ev = new EventPage(page);
      await ev.goto(EVENT_ID);
      await ev.inscreverParticipante(nome, 'teste@email.com');

      if (aceito) {
        await expect(ev.successMsg).toBeVisible();
      } else {
        await expect(ev.successMsg).not.toBeVisible();
        await expect(ev.nomeErroMsg).toBeVisible();
      }
    });
  }
});

// =============================================================================
// AC3 — Limite de vagas
// =============================================================================

test.describe('Limite de vagas (AC3)', () => {

  test('deve bloquear inscrição quando evento está com vagas esgotadas', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_LOTADO_ID);

    await ev.inscreverParticipante('João Novo', 'joao@email.com');

    await expect(ev.vagasEsgotadasMsg).toBeVisible();
    await expect(ev.successMsg).not.toBeVisible();
    expect(await ev.getVagasDisponiveis()).toBe(0);
  });

  test('deve permitir inscrição na última vaga e bloquear a seguinte', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_1_VAGA_ID);

    // inscrição na última vaga — deve funcionar
    await ev.inscreverParticipante('Maria Souza', 'maria@email.com');
    await expect(ev.successMsg).toBeVisible();
    expect(await ev.getVagasDisponiveis()).toBe(0);

    // tentativa seguinte — deve bloquear
    await ev.inscreverParticipante('Pedro Terceiro', 'pedro@email.com');
    await expect(ev.vagasEsgotadasMsg).toBeVisible();
    expect(await ev.getVagasDisponiveis()).toBe(0);
  });
});

// =============================================================================
// AC7 — Remoção de participante
// =============================================================================

test.describe('Remoção de participante (AC7)', () => {

  test('deve remover inscrito e atualizar lista e contador de vagas', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);

    await ev.inscreverParticipante('Maria Removida', 'maria.r@email.com');
    await expect(ev.successMsg).toBeVisible();

    const vagasAposInscricao = await ev.getVagasDisponiveis();

    await ev.removerParticipante('Maria Removida');

    await expect(ev.participantsList).not.toContainText('Maria Removida');
    expect(await ev.getVagasDisponiveis()).toBe(vagasAposInscricao + 1);
  });

  test('vagas devem ser restauradas após remover todos os inscritos', async ({ page }) => {
    const ev = new EventPage(page);
    await ev.goto(EVENT_ID);

    const totalVagas = await ev.getTotalVagas();

    const inscritos = [
      { nome: 'Inscrito Um',  email: 'um@email.com' },
      { nome: 'Inscrito Dois', email: 'dois@email.com' },
      { nome: 'Inscrito Tres', email: 'tres@email.com' },
    ];

    for (const { nome, email } of inscritos) {
      await ev.inscreverParticipante(nome, email);
      await expect(ev.successMsg).toBeVisible();
    }

    for (const { nome } of inscritos) {
      await ev.removerParticipante(nome);
    }

    await expect(ev.participantsList).toBeEmpty();
    expect(await ev.getVagasDisponiveis()).toBe(totalVagas);
  });
});
