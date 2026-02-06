import type { Locator, Page } from '@playwright/test';
import { expect, testStep } from '../../common/helpers/pwHelpers';

export class HomePage {
    readonly page: Page;
    readonly userId: number;
    readonly homePageTitle: Locator;
    readonly registerLink: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotInfoLink: Locator;
    readonly customerLoginTitle: Locator;

    constructor(page: Page, userId = 0) {
        this.page = page;
        this.userId = userId;
        this.homePageTitle = page.getByRole('img', { name: 'ParaBank' });
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.forgotInfoLink = page.getByRole('link', {
            name: 'Forgot login info?',
        });
        this.customerLoginTitle = page.getByRole('heading', {
            name: 'Customer Login',
        });
    }

    async step<T>(title: string, stepToRun: () => Promise<T>): Promise<T> {
        return await testStep(title, stepToRun, this.userId);
    }

    async goToHomePage(): Promise<void> {
        await this.step('Go to Home Page', async () => {
            await this.page.goto('parabank/index.htm');
        });
    }

    async clickRegisterLink(): Promise<void> {
        await this.step('Click Register Link', async () => {
            await this.registerLink.click();
        });
    }

    async clickForgotInfoLink(): Promise<void> {
        await this.step('Click Forgot Info Link', async () => {
            await this.forgotInfoLink.click();
        });
    }

    async fillInUsername(username: string): Promise<void> {
        await this.step('Fill in Username', async () => {
            await this.usernameInput.fill(username);
        });
    }

    async fillInPassword(password: string): Promise<void> {
        await this.step('Fill in Password', async () => {
            await this.passwordInput.fill(password);
        });
    }

    async clickLoginButton(): Promise<void> {
        await this.step('Click Login Button', async () => {
            await this.loginButton.click();
        });
    }

    async assertHomePageIsLoaded(): Promise<void> {
        await this.step('Assert Home Page is Loaded', async () => {
            await expect(this.homePageTitle).toBeVisible();
        });
    }

    async assertErrorMessage(errorMessage: string): Promise<void> {
        await this.step('Assert Error Message', async () => {
            const errorMessageLocator = this.page.getByText(errorMessage);
            await expect(errorMessageLocator).toBeVisible();
        });
    }

    async assertUserIsLoggedOut(): Promise<void> {
        await this.step('Assert Customer Login Title is Visible', async () => {
            await expect(this.customerLoginTitle).toBeVisible();
        });
    }
}
