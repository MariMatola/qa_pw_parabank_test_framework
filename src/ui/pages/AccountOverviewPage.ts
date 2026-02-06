import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';

export class AccountOverviewPage {
    readonly page: Page;
    readonly userId: number;
    readonly accountOverviewHeading: Locator;
    readonly accountsTable: Locator;
    readonly accountColumnHeader: Locator;
    readonly balanceColumnHeader: Locator;
    readonly availableAmountColumnHeader: Locator;
    readonly totalRow: Locator;
    readonly firstAccountLink: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.accountOverviewHeading = page.getByRole('heading', {
            name: 'Accounts Overview',
        });
        this.accountsTable = page.locator('#accountTable');
        this.accountColumnHeader = page.getByRole('columnheader', {
            name: 'Account',
        });
        this.balanceColumnHeader = page.getByRole('columnheader', {
            name: 'Balance*',
        });
        this.availableAmountColumnHeader = page.getByRole('columnheader', {
            name: 'Available Amount',
        });
        this.totalRow = page.locator('#accountTable tbody tr').last();
        this.firstAccountLink = page.locator('#accountTable a');
    }

    async openFirstAccountDetails(): Promise<void> {
        await this.step('Open First Account Details', async () => {
            await this.firstAccountLink.first().click();
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async getAccountNumberFromTheTableRow(rowNumber: number): Promise<string | null> {
        let accountNumber: string | null = null;
        await this.step('Get Account Number from the Table Row', async () => {
            const accountCell = this.page
                .locator('#accountTable tbody tr')
                .nth(rowNumber)
                .getByRole('cell')
                .nth(0);
            await expect(accountCell).toBeVisible();
            accountNumber = await accountCell.textContent();
        });
        return accountNumber;
    }

    async getTotalBalance(): Promise<string | null> {
        let totalBalance: string | null = null;
        await this.step('Get Total Balance', async () => {
            const totalBalanceCell = this.page
                .locator('#accountTable tbody tr')
                .last()
                .getByRole('cell')
                .nth(1);
            await expect(totalBalanceCell).toBeVisible();
            totalBalance = await totalBalanceCell.textContent();
        });
        return totalBalance;
    }

    async assertAccountOverviewPageIsLoaded(): Promise<void> {
        await this.step('Assert Account Overview Page is Loaded', async () => {
            await expect(this.accountOverviewHeading).toBeVisible();
        });
    }

    async assertAccountsTableIsVisible(): Promise<void> {
        await this.step('Assert Accounts Table is Visible', async () => {
            await expect(this.accountsTable).toBeVisible();
            await expect(this.accountColumnHeader).toBeVisible();
            await expect(this.balanceColumnHeader).toBeVisible();
            await expect(this.availableAmountColumnHeader).toBeVisible();
        });
    }

    async assertcorrectDataInTheTableRow(
        rowNumber: number,
        balanceAmount: string,
        availableAmount: string,
        accountNumber: string | null = null,
    ): Promise<void> {
        await this.step('Assert Correct Data in the Table Row', async () => {
            const row = this.page
                .locator('#accountTable tbody tr')
                .nth(rowNumber);
            const accountCell = row.getByRole('cell').nth(0);
            const balanceCell = row.getByRole('cell').nth(1);
            const availableAmountCell = row.getByRole('cell').nth(2);

            await expect(accountCell).toBeVisible();
            if (accountNumber) {
                await expect(accountCell).toContainText(accountNumber);
            }
            await expect(balanceCell).toBeVisible();
            await expect(balanceCell).toContainText(`${balanceAmount}`);
            await expect(availableAmountCell).toBeVisible();
            await expect(availableAmountCell).toContainText(availableAmount);
        });
    }

    async assertcorrectDataInTheTotalRow(totalAmount: string): Promise<void> {
        await this.step('Assert Correct Data in the Total Row', async () => {
            await expect(this.totalRow).toBeVisible();
            await expect(this.totalRow).toContainText(`${totalAmount}`);
        });
    }
}
