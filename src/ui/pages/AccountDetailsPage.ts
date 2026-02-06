import type { Locator, Page } from '@playwright/test';
import { testStep } from '../../common/helpers/pwHelpers';

export class AccountDetailsPage {
  page: Page;
  userId: number;
  fromDateInput: Locator;
  toDateInput: Locator;
  goButton: Locator;
  transactionTableRows: Locator;

  constructor(page: Page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.fromDateInput = page.locator('input[name="criteria.fromDate"]');
    this.toDateInput = page.locator('input[name="criteria.toDate"]');
    this.goButton = page.locator('input[value="Go"]');
    this.transactionTableRows = page.locator('#transactionTable tbody tr');
  }

  async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
    return await testStep(title, stepToRun, this.userId);
  }

  async filterTransactions(fromDate: string, toDate: string): Promise<void> {
    await this.step('Filter Transactions', async () => {
      await this.fromDateInput.fill(fromDate);
      await this.toDateInput.fill(toDate);
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
