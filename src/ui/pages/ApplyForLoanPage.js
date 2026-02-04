import { expect, testStep } from '../../common/helpers/pwHelpers';

export class ApplyForLoanPage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.applyForLoanHeading = page
        this.applyForLoanHeading = page
            .getByRole('heading', { name: 'Apply for a Loan' });
        this.amountInputField = page.locator('#amount');
        this.downPaymentInputField = page.locator('#downPayment');
        this.fromAccountIdSelectList = page.locator('#fromAccountId');
        this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
        this.loanRequestProcessedHeading = page
            .getByRole('heading', { name: 'Loan Request Processed' });
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }

    async assertApplyForLoanPageIsLoaded() {
        await this.step('Assert Apply For Loan Page is Loaded', async () => {
            await expect(this.applyForLoanHeading).toBeVisible();
        });
    }

    async fillInAmountInputField(amount) {
        await this.step('Fill In Amount Input Field', async () => {
            await expect(this.amountInputField).toBeVisible();
            await this.amountInputField.fill(amount);
        });
    }

    async fillInDownPaymentInputField(downPayment) {
        await this.step('Fill In Down Payment Input Field', async () => {
            await expect(this.downPaymentInputField).toBeVisible();
            await this.downPaymentInputField.fill(downPayment);
        });
    }

    async selectFromAccountId(fromAccountId) {
        await this.step('Select From Account ID', async () => {
            await expect(this.fromAccountIdSelectList).toBeVisible();
            await this.fromAccountIdSelectList.selectOption(fromAccountId);
        });
    }

    async clickApplyNowButton() {
        await this.step('Click Apply Now Button', async () => {
            await expect(this.applyNowButton).toBeVisible();
            await this.applyNowButton.click();
    
        });
    }
    async assertLoanRequestProcessedHeadingIsDisplayed() {
        await this.step(
            'Assert Loan Request Processed Heading is Displayed', async () => {
            await expect(this.loanRequestProcessedHeading).toBeVisible();
        });
    }
}