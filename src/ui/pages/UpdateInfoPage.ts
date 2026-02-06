import type { Locator, Page } from '@playwright/test';
import type { User } from '../../common/testData/generateNewUser';
import { expect, testStep } from '../../common/helpers/pwHelpers';
import {
    updateInfoFormFields,
    type UpdateInfoFormField,
} from '../constants/updateInfoFormConstants';

type UpdateInfoFormData = Pick<
    User,
    | 'firstName'
    | 'lastName'
    | 'address'
    | 'city'
    | 'state'
    | 'zipCode'
    | 'phoneNumber'
>;

export class UpdateInfoPage {
    readonly page: Page;
    readonly userId: number;
    readonly updateInfoPageTitle: Locator;
    readonly updateProfileButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.updateInfoPageTitle = page.getByRole('heading', {
            name: 'Update Profile',
        });
        this.updateProfileButton = page.getByRole('button', {
            name: 'Update Profile',
        });
        this.successMessage = page.getByRole('heading', {
            name: 'Profile Updated',
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async fillInFormField(
        field: UpdateInfoFormField,
        value: string,
    ): Promise<void> {
        await this.step(`Fill in ${field.name}`, async () => {
            await this.page.locator(field.locator).fill(value);
        });
    }

    async fillInUpdateInfoForm(
        userData: UpdateInfoFormData,
        skipFieldName: string | null = null,
    ): Promise<void> {
        await this.step('Fill in Update Info form', async () => {
            const fieldMapping: Record<string, string> = {
                'First Name': userData.firstName,
                'Last Name': userData.lastName,
                Address: userData.address,
                City: userData.city,
                State: userData.state,
                'Zip Code': userData.zipCode,
                'Phone Number': userData.phoneNumber,
            };

            for (const field of updateInfoFormFields) {
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

    async clickUpdateProfileButton(): Promise<void> {
        await this.step('Click Update Profile Button', async () => {
            await this.updateProfileButton.click();
        });
    }

    async assertUpdateInfoPageIsLoaded(): Promise<void> {
        await this.step('Assert Update Info Page is Loaded', async () => {
            await expect(this.updateInfoPageTitle).toBeVisible();
        });
    }

    async assertErrorMessage(errorMessage: string): Promise<void> {
        await this.step('Assert Error Message', async () => {
            const errorMessageLocator = this.page.getByText(errorMessage);
            await expect(errorMessageLocator).toBeVisible();
        });
    }

    async assertSuccessMessage(): Promise<void> {
        await this.step('Assert Success Message', async () => {
            await expect(this.successMessage).toBeVisible();
        });
    }
}
