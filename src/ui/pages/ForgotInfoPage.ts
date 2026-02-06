import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';
import { HomePage } from './HomePage';
import {
    type ForgotLoginInfoFormField,
    ForgotLoginInfoFormFields,
} from '../constants/forgotLoginInfoFormConstants';

export interface ForgotInfoFormUserData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    ssn: string;
}

export class ForgotInfoPage {
    readonly page: Page;
    readonly userId: number;
    readonly forgotInfoPageTitle: Locator;
    readonly findMyLoginInfoButton: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.forgotInfoPageTitle = page.getByRole('heading', {
            name: 'Customer Lookup',
        });
        this.findMyLoginInfoButton = page.getByRole('button', {
            name: 'Find My Login Info',
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async fillInFormField(
        field: ForgotLoginInfoFormField,
        value: string,
    ): Promise<void> {
        await this.step(`Fill in ${field.name}`, async () => {
            await this.page.locator(field.locator).fill(value);
        });
    }

    async fillInForgotInfoForm(
        userData: ForgotInfoFormUserData,
        skipFieldName: string | null = null,
    ): Promise<void> {
        await this.step('Fill in Forgot Info form', async () => {
            const fieldMapping: Record<string, string> = {
                'First Name': userData.firstName,
                'Last Name': userData.lastName,
                'Address': userData.address,
                'City': userData.city,
                'State': userData.state,
                'Zip Code': userData.zipCode,
                'SSN': userData.ssn,
            };

            for (const field of ForgotLoginInfoFormFields) {
                if (skipFieldName && field.name === skipFieldName) {
                    continue;
                }

                const value = fieldMapping[field.name];
                if (value) {
                    await this.fillInFormField(field, value);
                }
            }
        });
    }

    async goToForgotInfoPage(): Promise<void> {
        await this.step('Go to Forgot Info Page', async () => {
            const homePage = new HomePage(this.page);
            await homePage.goToHomePage();
            await homePage.assertHomePageIsLoaded();
            await homePage.clickForgotInfoLink();
        });
    }

    async clickFindMyLoginInfoButton(): Promise<void> {
        await this.step('Click Find My Login Info Button', async () => {
            await this.findMyLoginInfoButton.click();
        });
    }

    async assertForgotInfoPageIsLoaded(): Promise<void> {
        await this.step('Assert Forgot Info Page is Loaded', async () => {
            await expect(this.forgotInfoPageTitle).toBeVisible();
        });
    }

    async assertErrorMessage(errorMessage: string): Promise<void> {
        await this.step('Assert Error Message', async () => {
            const errorMessageLocator = this.page.getByText(errorMessage);
            await expect(errorMessageLocator).toBeVisible();
        });
    }
}
