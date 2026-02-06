import { expect, testStep } from '../../common/helpers/pwHelpers';
import { billPayFormFields } from '../constants/billPayFormConstants';

export class PayBillPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.payBillHeading = page
            .getByRole('heading', { name: 'Bill Payment Service' });
        this.sendPaymentButton = page
            .getByRole('button', { name: 'Send Payment' });
        this.accountIdSelectList = page.locator('select[name="fromAccountId"]');
        this.billPaymentCompleteHeading = page
            .getByRole('heading', { name: 'Bill Payment Complete' });
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertPayBillPageIsLoaded() {
        await this.step('Assert Pay Bill Page is Loaded', async () => {
            await expect(this.payBillHeading).toBeVisible();
        });
    }

    async fillInFormField(field, value) {
        await this.step(`Fill in ${field.name}`, async () => {
            await this.page.locator(field.locator).fill(value);
        });
    }

    async fillInBillPayForm(userData, accountNumber, amount) {
        await this.step(`Fill in Bill Pay form`, async () => {
            // Map form field names to user data properties
            const fieldMapping = {
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

    async selectAccountId(accountId) {
        await this.step('Select Account ID', async () => {
            await this.accountIdSelectList.selectOption(accountId);
        });
    }

    async clickSendPaymentButton() {
        await this.step(`Click Send Payment Button`, async () => {
            await this.sendPaymentButton.click();
        });
    }

    async assertBillPaySuccessfulMessageIsDisplayed() {
        await this.step(
            'Assert Bill Pay Successful Message is Displayed', 
            async () => {
            await expect(this.billPaymentCompleteHeading).toBeVisible();
        });
    }
}
