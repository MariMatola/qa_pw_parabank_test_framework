import { expect, testStep } from '../../common/helpers/pwHelpers';

export class AccountOverviewPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.accountOverviewHeading = page.getByRole('heading', {
            name: 'Accounts Overview'
        });
        this.accountsTable = page.locator('#accountTable');
        this.accountColumnHeader = page
            .getByRole('columnheader', { name: 'Account' });
        this.balanceColumnHeader = page
            .getByRole('columnheader', { name: 'Balance*' });
        this.availableAmountColumnHeader = page
            .getByRole('columnheader', { name: 'Available Amount' });
        this.totalRow = page.locator('#accountTable tbody tr').last();
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }

    async getAccountNumberFromTheTableRow(rowNumber) {
        let accountNumber = null;
        await this.step('Get Account Number from the Table Row', async () => {
            await expect(this.page.locator('#accountTable tbody tr')
                .nth(rowNumber)
                .getByRole('cell')
                .nth(0)).toBeVisible();
            accountNumber = await this.page.locator('#accountTable tbody tr')
                .nth(rowNumber)
                .getByRole('cell')
                .nth(0)
                .textContent();
        });
        return accountNumber;
    }

    async getTotalBalance() {
        let totalBalance = null;
        await this.step('Get Total Balance', async () => {
            await expect(this.page.locator('#accountTable tbody tr')
                .last()
                .getByRole('cell')
                .nth(1)).toBeVisible();
            totalBalance = await this.page.locator('#accountTable tbody tr')
                .last()
                .getByRole('cell')
                .nth(1)
                .textContent();
        });
        return totalBalance;
    }

    async assertAccountOverviewPageIsLoaded() {
        await this.step('Assert Account Overview Page is Loaded', async () => {
            await expect(this.accountOverviewHeading).toBeVisible();
        });
    }

    async assertAccountsTableIsVisible() {
        await this.step('Assert Accounts Table is Visible', async () => {
            await expect(this.accountsTable).toBeVisible();
            await expect(this.accountColumnHeader).toBeVisible();
            await expect(this.balanceColumnHeader).toBeVisible();
            await expect(this.availableAmountColumnHeader).toBeVisible();
        });
    }

    async assertcorrectDataInTheTableRow(
        rowNumber, balanceAmount, availableAmount, accountNumber = null
    ) {
        await this.step('Assert Correct Data in the Table Row', async () => {
            const row = this.page.locator('#accountTable tbody tr')
                .nth(rowNumber);
            await expect(row.getByRole('cell').nth(0)).toBeVisible();
            if (accountNumber) {
                await expect(row.getByRole('cell').nth(0))
                    .toContainText(accountNumber);
            }
            await expect(row.getByRole('cell').nth(1)).toBeVisible();
            await expect(row.getByRole('cell').nth(1))
                .toContainText(`${balanceAmount}`);
            await expect(row.getByRole('cell').nth(2)).toBeVisible();
            await expect(row.getByRole('cell').nth(2))
                .toContainText(availableAmount);
        });
    }

    async assertcorrectDataInTheTotalRow(totalAmount) {
        await this.step('Assert Correct Data in the Total Row', async () => {
            await expect(this.totalRow).toBeVisible();
            await expect(this.totalRow)
                .toContainText(`${totalAmount}`);
        });
    }
}
