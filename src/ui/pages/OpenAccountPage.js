import { expect, testStep } from '../../common/helpers/pwHelpers';

export class OpenAccountPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.openNewAccountHeading = page
            .getByRole('heading', { name: 'Open New Account' });
        this.accountTypeSelectList = page.locator('#type');
        this.fromAccountIdSelectList = page.locator('#fromAccountId');
        this.openNewAccountButton = page
            .getByRole('button', { name: 'Open New Account' });
        this.accountOpenedSuccessfullyMessage = page
            .getByText('Account Opened!');
        this.newAccountId = page.locator('#newAccountId');
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }
    // CHECKING or SAVINGS
    async selectAccountType(accountType) {
        await this.step('Select Account Type', async () => {
            await this.accountTypeSelectList.selectOption(accountType);
        });
    }

    async selectFromAccountId(fromAccountId) {
        await this.step('Select From Account ID', async () => {
            await expect(this.fromAccountIdSelectList).toBeVisible();
            await this.fromAccountIdSelectList.selectOption(fromAccountId);
        });
    }

    async clickOpenNewAccountButton() {
        await this.step('Click Open New Account Button', async () => {
            await this.openNewAccountButton.click();
        });
    }

    async getNewAccountId() {
        return await this.newAccountId.textContent();
    }

    async assertAccountOverviewPageIsLoaded() {
        await this.step('Assert Account Overview Page is Loaded', async () => {
            await expect(this.accountOverviewHeading).toBeVisible();
        });
    }

    async assertOpenNewAccountPageIsLoaded() {
        await this.step('Assert Open New Account Page is Loaded', async () => {
            await expect(this.openNewAccountHeading).toBeVisible();
        });
    }

    async assertAccountOpenedMessageIsDisplayed() {
        await this
            .step('Assert Account Opened Successfully Message is Visible',
                async () => {
                    await expect(this.accountOpenedSuccessfullyMessage)
                        .toBeVisible();
                });
    }
}
