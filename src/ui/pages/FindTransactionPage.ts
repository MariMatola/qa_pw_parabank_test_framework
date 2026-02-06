import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';

export class FindTransactionsPage {
    readonly page: Page;
    readonly userId: number;
    readonly findTransactionsHeading: Locator;
    readonly accountIdInputField: Locator;
    readonly transactionIdInputField: Locator;
    readonly amountInputField: Locator;
    readonly findTransactionsByAccountIdButton: Locator;
    readonly findTransactionsByTransactionIdButton: Locator;
    readonly findTransactionsByAmountButton: Locator;
    readonly findTransactionsByDateButton: Locator;
    readonly fromDateInputField: Locator;
    readonly toDateInputField: Locator;
    readonly transactionTable: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.findTransactionsHeading = page.getByRole('heading', {
            name: 'Find Transactions',
        });
        this.accountIdInputField = page.locator('#accountId');
        this.transactionIdInputField = page.locator(
            'input[name="criteria.transactionId"]',
        );
        this.amountInputField = page.locator('input[name="criteria.amount"]');
        this.findTransactionsByAccountIdButton = page
            .locator('form')
            .filter({ has: page.locator('#accountId') })
            .getByRole('button', { name: 'Find Transactions' });
        this.findTransactionsByTransactionIdButton = page
            .locator('form')
            .filter({ has: this.transactionIdInputField })
            .getByRole('button', { name: 'Find Transactions' });
        this.findTransactionsByAmountButton = page
            .locator('form')
            .filter({ has: this.amountInputField })
            .getByRole('button', { name: 'Find Transactions' });
        this.findTransactionsByDateButton = page
            .locator('form')
            .filter({ has: page.locator('#fromDate') })
            .getByRole('button', { name: 'Find Transactions' });
        this.fromDateInputField = page.locator('#fromDate');
        this.toDateInputField = page.locator('#toDate');
        this.transactionTable = page.locator('#transactionTable');
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertFindTransactionsPageIsLoaded(): Promise<void> {
        await this.step('Assert Find Transactions Page is Loaded', async () => {
            await expect(this.findTransactionsHeading).toBeVisible();
        });
    }

    async findTransactionsByAccountId(accountId: string): Promise<void> {
        await this.step('Search By Account', async () => {
            await expect(this.accountIdInputField).toBeVisible();
            await this.accountIdInputField.selectOption(String(accountId));
            await this.findTransactionsByAccountIdButton.click();
            await expect(this.transactionTable).toBeVisible();
        });
    }

    async searchByAccount(accountId: string): Promise<void> {
        return this.findTransactionsByAccountId(accountId);
    }

    async searchByTransactionId(transactionId: string): Promise<void> {
        await this.step('Search By Transaction ID', async () => {
            await expect(this.transactionIdInputField).toBeVisible();
            await this.transactionIdInputField.fill(String(transactionId));
            await this.findTransactionsByTransactionIdButton.click();
            await expect(this.transactionTable).toBeVisible();
        });
    }

    async searchByAmount(amount: string): Promise<void> {
        await this.step('Search By Amount', async () => {
            await expect(this.amountInputField).toBeVisible();
            await this.amountInputField.fill(String(amount));
            await this.findTransactionsByAmountButton.click();
            await expect(this.transactionTable).toBeVisible();
        });
    }

    async getResultsCount(): Promise<number> {
        return await this.step('Get Results Count', async () => {
            await expect(this.transactionTable).toBeVisible();
            return await this.page
                .locator('#transactionTable tbody tr')
                .count();
        });
    }

    async findTransactionsByDate(
        fromDate: string,
        toDate: string,
    ): Promise<void> {
        await this.step('Search By Date', async () => {
            await expect(this.fromDateInputField).toBeVisible();
            await this.fromDateInputField.fill(fromDate);
            await expect(this.toDateInputField).toBeVisible();
            await this.toDateInputField.fill(toDate);
            await this.findTransactionsByDateButton.click();
            await expect(this.transactionTable).toBeVisible();
        });
    }
}
