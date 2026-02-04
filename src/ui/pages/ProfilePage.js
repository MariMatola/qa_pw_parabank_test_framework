import { expect, testStep } from '../../common/helpers/pwHelpers';

export class ProfilePage {
    constructor(page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.logOutLink = page.getByRole('link', { name: 'Log Out' });
        this.updateContactInfoLink = page
            .getByRole('link', { name: 'Update Contact Info' });
        this.accountOverviewLink = page
            .getByRole('link', { name: 'Accounts Overview' });
        this.openNewAccountLink = page
            .getByRole('link', { name: 'Open New Account' });
        this.transferFundsLink = page
            .getByRole('link', { name: 'Transfer Funds' });
        this.payBillLink = page
            .getByRole('link', { name: 'Bill Pay' });
        this.requestLoanLink = page
            .getByRole('link', { name: 'Request Loan' });
        this.findTransactionsLink = page
            .getByRole('link', { name: 'Find Transactions' });
    }

    async step(title, stepToRun) {
        return await testStep(title, stepToRun, this.userId);
    }

    async clickLogOutLink() {
        await this.step(`Click Log Out Link`, async () => {
            await this.logOutLink.click();
        });
    }
    async clickUpdateContactInfoLink() {
        await this.step(`Click Update Contact Info Link`, async () => {
            await this.updateContactInfoLink.click();
        });
    }
    async clickAccountOverviewLink() {
        await this.step(`Click Account Overview Link`, async () => {
            await this.accountOverviewLink.click();
        });
    }

    async clickOpenNewAccountLink() {
        await this.step(`Click Open New Account Link`, async () => {
            await this.openNewAccountLink.click();
        });
    }

    async clickTransferFundsLink() {
        await this.step(`Click Transfer Funds Link`, async () => {
            await this.transferFundsLink.click();
        });
    }

    async clickPayBillLink() {
        await this.step(`Click Pay Bill Link`, async () => {
            await this.payBillLink.click();
        });
    }

    async clickRequestLoanLink() {
        await this.step(`Click Request Loan Link`, async () => {
            await this.requestLoanLink.click();
        });
    }

    async clickFindTransactionsLink() {
        await this.step(`Click Find Transactions Link`, async () => {
            await this.findTransactionsLink.click();
        });
    }

    async assertUserIsRegistered(username) {
        await this.step(`Assert User is Logged In`, async () => {
            const welcomeMessage = this.page.getByText(`Welcome ${username}`);
            await expect(welcomeMessage).toBeVisible();
        });
    }

    async assertUserIsLoggedIn(firstName, lastName) {
        await this.step(`Assert User is Logged In`, async () => {
            const welcomeMessage = this.page
                .getByText(`Welcome ${firstName} ${lastName}`);
            await expect(welcomeMessage).toBeVisible();
        });
    }

    async assertCorrectLoginInfo(username, password) {
        await this.step(`Assert Correct Login Info`, async () => {
            const loginInfo = this.page
                .getByText(`Username: ${username} Password: ${password}`);
            await expect(loginInfo).toBeVisible();
        });
    }
}
