import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object para a página de gerenciamento de evento.
 * Encapsula todos os seletores e ações relacionados ao formulário
 * de inscrição e à lista de participantes.
 */
export class EventPage {
  readonly page: Page;

  // Formulário de inscrição
  readonly nomeInput: Locator;
  readonly emailInput: Locator;
  readonly telefoneInput: Locator;
  readonly inscreverBtn: Locator;

  // Feedback
  readonly successMsg: Locator;
  readonly vagasEsgotadasMsg: Locator;
  readonly emailErroMsg: Locator;
  readonly nomeErroMsg: Locator;

  // Lista de inscritos
  readonly participantsList: Locator;
  readonly vagasBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nomeInput    = page.getByLabel('Nome Completo');
    this.emailInput   = page.getByLabel('E-mail');
    this.telefoneInput = page.getByLabel('Telefone com DDD');
    this.inscreverBtn = page.getByRole('button', { name: 'Inscrever' });

    this.successMsg         = page.getByText('Inscrição realizada com sucesso!');
    this.vagasEsgotadasMsg  = page.getByText('Vagas esgotadas!');
    this.emailErroMsg       = page.getByTestId('email-error');
    this.nomeErroMsg        = page.getByTestId('nome-error');

    this.participantsList = page.getByTestId('lista-inscritos');
    this.vagasBadge       = page.getByTestId('vagas-badge');
  }

  async goto(eventId: string) {
    await this.page.goto(`/eventos/${eventId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Preenche o formulário e submete a inscrição */
  async inscreverParticipante(nome: string, email: string, telefone?: string) {
    await this.nomeInput.fill(nome);
    await this.emailInput.fill(email);
    if (telefone) await this.telefoneInput.fill(telefone);
    await this.inscreverBtn.click();
  }

  /** Clica em Remover ao lado do participante pelo nome */
  async removerParticipante(nome: string) {
    const row = this.participantsList
      .locator(`[data-testid="inscrito-item"]`)
      .filter({ hasText: nome });
    await row.getByRole('button', { name: 'Remover' }).click();
  }

  /** Retorna o número de vagas disponíveis */
  async getVagasDisponiveis() {
    const badge = await this.vagasBadge.innerText();
    return Number(badge.split('/')[0]);
}

  /** Retorna o total de vagas do evento (ex: "47/50" → 50) */
  async getTotalVagas(): Promise<number> {
    const text = await this.vagasBadge.innerText();
    return parseInt(text.split('/')[1].trim(), 10);
  }

  /** Verifica se um participante aparece na lista pelo nome */
  async participanteEstaNaLista(nome: string): Promise<boolean> {
    return await this.participantsList
      .locator(`[data-testid="inscrito-item"]`)
      .filter({ hasText: nome })
      .isVisible();
  }
}
