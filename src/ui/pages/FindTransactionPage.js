import { expect, testStep } from '../../common/helpers/pwHelpers';

export class FindTransactionsPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.findTransactionsHeading = page
            .getByRole('heading', { name: 'Find Transactions' });
        this.accountIdInputField = page.locator('#accountId');
        this.findTransactionsButton = page
            .getByRole('button', { name: 'Find Transactions' })
            .first();
        this.fromDateInputField = page.locator('#fromDate');
        this.toDateInputField = page.locator('#toDate');
        this.transactionTable = page.locator('#transactionTable');
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }
    async assertFindTransactionsPageIsLoaded() {
        await this.step('Assert Find Transactions Page is Loaded', async () => {
            await expect(this.findTransactionsHeading).toBeVisible();
        });
    }

    async searchByAccount(accountId) {
        await this.step('Search By Account', async () => {
            await expect(this.accountIdInputField).toBeVisible();
            await this.accountIdInputField.fill(accountId);
            await this.findTransactionsButton.click();
            await expect(this.transactionTable)
                .toBeVisible();
        });
    }

    
    async getResultsCount() {
        await this.step('Get Results Count', async () => {
            await expect(this.transactionTable).toBeVisible();
            return await this.page
                .locator('#transactionTable tbody tr').count();
        });
    }

    async searchByDate(fromDate, toDate) {
        await this.step('Search By Date', async () => {
            await expect(this.fromDateInputField).toBeVisible();
            await this.fromDateInputField.fill(fromDate);
            await expect(this.toDateInputField).toBeVisible();
            await this.toDateInputField.fill(toDate);
            await this.findTransactionsButton.click();
            await expect(this.transactionTable).toBeVisible();
        });
    }
}