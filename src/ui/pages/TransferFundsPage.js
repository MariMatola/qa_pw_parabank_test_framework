import { expect, testStep } from '../../common/helpers/pwHelpers';

export class TransferFundsPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.transferFundsHeading = page
            .getByRole('heading', { name: 'Transfer Funds' });
        this.amountInputField = page.locator('#amount');
        this.fromAccountIdSelectList = page.locator('#fromAccountId');
        this.toAccountIdSelectList = page.locator('#toAccountId');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferSuccessfulMessage = page
            .getByRole('heading', { name: 'Transfer Complete!' });
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertTransferFundsPageIsLoaded() {
        await this.step('Assert Transfer Funds Page is Loaded', async () => {
            await expect(this.transferFundsHeading).toBeVisible();
        });
    }

    async fillAmountInputField(amount) {
        await this.step('Fill Amount Input Field', async () => {
            await expect(this.amountInputField).toBeVisible();
            await this.amountInputField.fill(amount);
        });
    }

    async selectFromAccountId(fromAccountId) {
        await this.step('Select From Account ID', async () => {
            await expect(this.fromAccountIdSelectList).toBeVisible();
            await this.fromAccountIdSelectList.selectOption(fromAccountId);
        });
    }

    async selectToAccountId(toAccountId) {
        await this.step('Select To Account ID', async () => {
            await expect(this.toAccountIdSelectList).toBeVisible();
            await this.toAccountIdSelectList.selectOption(toAccountId);
        });
    }

    async clickTransferButton() {
        await this.step('Click Transfer Button', async () => {
            await expect(this.transferButton).toBeVisible();
            await this.transferButton.click();
        });
    }

    async assertTransferSuccessfulMessageIsDisplayed() {
        await this.step(
            'Assert Transfer Successful Message is Displayed', async () => {
                await expect(this.transferSuccessfulMessage).toBeVisible();
            });
    }
}
