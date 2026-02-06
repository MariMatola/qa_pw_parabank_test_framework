import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';
import {
    type BillPayFormField,
    billPayFormFields,
} from '../constants/billPayFormConstants';

export interface PayBillFormUserData {
    firstName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
}

export class PayBillPage {
    readonly page: Page;
    readonly userId: number;
    readonly payBillHeading: Locator;
    readonly sendPaymentButton: Locator;
    readonly accountIdSelectList: Locator;
    readonly billPaymentCompleteHeading: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.payBillHeading = page.getByRole('heading', {
            name: 'Bill Payment Service',
        });
        this.sendPaymentButton = page.getByRole('button', {
            name: 'Send Payment',
        });
        this.accountIdSelectList = page.locator(
            'select[name="fromAccountId"]',
        );
        this.billPaymentCompleteHeading = page.getByRole('heading', {
            name: 'Bill Payment Complete',
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertPayBillPageIsLoaded(): Promise<void> {
        await this.step('Assert Pay Bill Page is Loaded', async () => {
            await expect(this.payBillHeading).toBeVisible();
        });
    }

    async fillInFormField(
        field: BillPayFormField,
        value: string,
    ): Promise<void> {
        await this.step(`Fill in ${field.name}`, async () => {
            await this.page.locator(field.locator).fill(value);
        });
    }

    async fillInBillPayForm(
        userData: PayBillFormUserData,
        accountNumber: string,
        amount: string,
    ): Promise<void> {
        await this.step('Fill in Bill Pay form', async () => {
            const fieldMapping: Record<string, string> = {
                'Payee Name': userData.firstName,
                'Address': userData.address,
                'City': userData.city,
                'State': userData.state,
                'Zip Code': userData.zipCode,
                'Phone Number': userData.phoneNumber,
                'Account #': accountNumber,
                'Verify Account': accountNumber,
                'Amount': amount,
            };

            for (const field of billPayFormFields) {
                const value = fieldMapping[field.name];
                if (value) {
                    await this.fillInFormField(field, value);
                }
            }
        });
    }

    async selectAccountId(accountId: string): Promise<void> {
        await this.step('Select Account ID', async () => {
            await this.accountIdSelectList.selectOption(accountId);
        });
    }

    async clickSendPaymentButton(): Promise<void> {
        await this.step('Click Send Payment Button', async () => {
            await this.sendPaymentButton.click();
        });
    }

    async assertBillPaySuccessfulMessageIsDisplayed(): Promise<void> {
        await this.step(
            'Assert Bill Pay Successful Message is Displayed',
            async () => {
                await expect(
                    this.billPaymentCompleteHeading,
                ).toBeVisible();
            },
        );
    }
}
