import { testStep } from '../../common/helpers/pwHelpers';

export class AccountDetailsPage {

  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.firstAccountLink = page.locator('#accountTable a');
    this.fromDateInput = page.locator('input[name="criteria.fromDate"]');
    this.toDateInput = page.locator('input[name="criteria.toDate"]');       
    this.goButton = page.locator('input[value="Go"]');
    this.transactionTableRows = page.locator('#transactionTable tbody tr');
  }
  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
}

  async openFirstAccountDetails() {
    await this.step('Open First Account Details', async () => {
      await this.firstAccountLink.click();
    });
  }

  async filterTransactions(fromDate, toDate) {
    await this.step('Filter Transactions', async () => {
      await this.fromDateInput.fill(fromDate);
      await this.toDateInput.fill(toDate);
      await this.goButton.click();
    });
  }

  async getTransactionsCount() {
    await this.step('Get Transactions Count', async () => {
      return await this.transactionTableRows.count();
    });
  }
}