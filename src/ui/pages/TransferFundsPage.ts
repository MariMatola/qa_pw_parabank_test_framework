import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';

export class TransferFundsPage {
    readonly page: Page;
    readonly userId: number;
    readonly transferFundsHeading: Locator;
    readonly amountInputField: Locator;
    readonly fromAccountIdSelectList: Locator;
    readonly toAccountIdSelectList: Locator;
    readonly transferButton: Locator;
    readonly transferSuccessfulMessage: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.transferFundsHeading = page.getByRole('heading', {
            name: 'Transfer Funds',
        });
        this.amountInputField = page.locator('#amount');
        this.fromAccountIdSelectList = page.locator('#fromAccountId');
        this.toAccountIdSelectList = page.locator('#toAccountId');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferSuccessfulMessage = page.getByRole('heading', {
            name: 'Transfer Complete!',
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertTransferFundsPageIsLoaded(): Promise<void> {
        await this.step('Assert Transfer Funds Page is Loaded', async () => {
            await expect(this.transferFundsHeading).toBeVisible();
        });
    }

    async fillAmountInputField(amount: string): Promise<void> {
        await this.step('Fill Amount Input Field', async () => {
            await expect(this.amountInputField).toBeVisible();
            await this.amountInputField.fill(amount);
        });
    }

    async selectFromAccountId(fromAccountId: string): Promise<void> {
        await this.step('Select From Account ID', async () => {
            await expect(this.fromAccountIdSelectList).toBeVisible();
            await this.fromAccountIdSelectList.selectOption(fromAccountId);
        });
    }

    async selectToAccountId(toAccountId: string): Promise<void> {
        await this.step('Select To Account ID', async () => {
            await expect(this.toAccountIdSelectList).toBeVisible();
            await this.toAccountIdSelectList.selectOption(toAccountId);
        });
    }

    async clickTransferButton(): Promise<void> {
        await this.step('Click Transfer Button', async () => {
            await expect(this.transferButton).toBeVisible();
            await this.transferButton.click();
        });
    }

    async assertTransferSuccessfulMessageIsDisplayed(): Promise<void> {
        await this.step(
            'Assert Transfer Successful Message is Displayed',
            async () => {
                await expect(this.transferSuccessfulMessage).toBeVisible();
            },
        );
    }
}
