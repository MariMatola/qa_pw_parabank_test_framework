import type { Locator, Page } from '@playwright/test';
import type { User } from '../../common/testData/generateNewUser';
import { expect, testStep } from '../../common/helpers/pwHelpers';
import { HomePage } from './HomePage';
import {
    signUpFormFields,
    type SignUpFormField,
} from '../constants/signUpFormConstants';

export class SignUpPage {
    readonly page: Page;
    readonly userId: number;
    readonly signUpPageTitle: Locator;
    readonly registerButton: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.signUpPageTitle = page.getByRole('heading', {
            name: 'Signing up is easy!',
        });
        this.registerButton = page.getByRole('button', { name: 'Register' });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async fillInFormField(
        field: SignUpFormField,
        value: string,
    ): Promise<void> {
        await this.step(`Fill in ${field.name}`, async () => {
            await this.page.locator(field.locator).fill(value);
        });
    }

    async fillInSignUpForm(
        userData: User,
        skipFieldName: string | null = null,
    ): Promise<void> {
        await this.step('Fill in Sign Up form', async () => {
            const fieldMapping: Record<string, string> = {
                'First Name': userData.firstName,
                'Last Name': userData.lastName,
                Address: userData.address,
                City: userData.city,
                State: userData.state,
                'Zip Code': userData.zipCode,
                'Phone Number': userData.phoneNumber,
                SSN: userData.ssn,
                Username: userData.username,
                Password: userData.password,
                'Confirm Password': userData.confirmPassword,
            };

            for (const field of signUpFormFields) {
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

    async goToSignUpPage(): Promise<void> {
        await this.step('Go to Sign Up Page', async () => {
            const homePage = new HomePage(this.page);
            await homePage.goToHomePage();
            await homePage.assertHomePageIsLoaded();
            await homePage.clickRegisterLink();
        });
    }

    async clickRegisterButton(): Promise<void> {
        await this.step('Click Register Button', async () => {
            await this.registerButton.click();
        });
    }

    async assertSignUpPageIsLoaded(): Promise<void> {
        await this.step('Assert Sign Up Page is Loaded', async () => {
            await expect(this.signUpPageTitle).toBeVisible();
        });
    }

    async assertErrorMessage(errorMessage: string): Promise<void> {
        await this.step('Assert Error Message', async () => {
            const errorMessageLocator = this.page.getByText(errorMessage);
            await expect(errorMessageLocator).toBeVisible();
        });
    }
}
