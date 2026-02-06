import type { Locator, Page } from '@playwright/test';
import { testStep } from '../../common/helpers/pwHelpers';

export class AccountDetailsPage {
  page: Page;
  userId: number;
  activityPeriodSelect: Locator;
  typeSelect: Locator;
  goButton: Locator;
  transactionTableRows: Locator;

  constructor(page: Page, userId = 0) {
    this.page = page;
    this.userId = userId;
    // Account Details page filters by Activity Period (month) and Type, not by date range
    this.activityPeriodSelect = page
      .getByRole('row', { name: /Activity Period/ })
      .getByRole('combobox');
    this.typeSelect = page
      .getByRole('row', { name: /Type/ })
      .getByRole('combobox');
    this.goButton = page.getByRole('button', { name: 'Go' });
    this.transactionTableRows = page.locator('#transactionTable tbody tr');
  }

  async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
    return await testStep(title, stepToRun, this.userId);
  }

  /** Filter Account Activity by period (e.g. "All", "January") and type (e.g. "All", "Credit", "Debit"). */
  async filterTransactionsByPeriodAndType(
    period: string,
    type: string,
  ): Promise<void> {
    await this.step('Filter Transactions', async () => {
      await this.activityPeriodSelect.selectOption(period);
      await this.typeSelect.selectOption(type);
      await this.goButton.click();
    });
  }

  async getTransactionsCount(): Promise<number> {
    return await this.step('Get Transactions Count', async () => {
      return await this.transactionTableRows.count();
    });
  }

  async getTransactionIdFromRow(rowIndex: number): Promise<string | null> {
    return await this.step('Get Transaction ID from Row', async () => {
      const row = this.transactionTableRows.nth(rowIndex);
      const firstCell = row.locator('td').first();
      const link = firstCell.locator('a').first();
      const count = await link.count();
      const text = count > 0 ? await link.textContent() : await firstCell.textContent();
      return text ? text.trim() : null;
    });
  }
}
