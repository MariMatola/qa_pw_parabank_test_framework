import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';

export class OpenAccountPage {
    readonly page: Page;
    readonly userId: number;
    readonly openNewAccountHeading: Locator;
    readonly accountTypeSelectList: Locator;
    readonly fromAccountIdSelectList: Locator;
    readonly openNewAccountButton: Locator;
    readonly accountOpenedSuccessfullyMessage: Locator;
    readonly newAccountId: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.openNewAccountHeading = page.getByRole('heading', {
            name: 'Open New Account',
        });
        this.accountTypeSelectList = page.locator('#type');
        this.fromAccountIdSelectList = page.locator('#fromAccountId');
        this.openNewAccountButton = page.getByRole('button', {
            name: 'Open New Account',
        });
        this.accountOpenedSuccessfullyMessage = page.getByText(
            'Account Opened!',
        );
        this.newAccountId = page.locator('#newAccountId');
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async selectAccountType(accountType: string): Promise<void> {
        await this.step('Select Account Type', async () => {
            await this.accountTypeSelectList.selectOption(accountType);
        });
    }

    async selectFromAccountId(fromAccountId: string): Promise<void> {
        await this.step('Select From Account ID', async () => {
            await expect(this.fromAccountIdSelectList).toBeVisible();
            await this.fromAccountIdSelectList.selectOption(fromAccountId);
        });
    }

    async clickOpenNewAccountButton(): Promise<void> {
        await this.step('Click Open New Account Button', async () => {
            await this.openNewAccountButton.click();
        });
    }

    async getNewAccountId(): Promise<string | null> {
        return await this.newAccountId.textContent();
    }

    async assertOpenNewAccountPageIsLoaded(): Promise<void> {
        await this.step('Assert Open New Account Page is Loaded', async () => {
            await expect(this.openNewAccountHeading).toBeVisible();
        });
    }

    async assertAccountOpenedMessageIsDisplayed(): Promise<void> {
        await this.step(
            'Assert Account Opened Successfully Message is Visible',
            async () => {
                await expect(
                    this.accountOpenedSuccessfullyMessage,
                ).toBeVisible();
            },
        );
    }
}
