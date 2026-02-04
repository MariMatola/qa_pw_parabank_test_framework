import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { AccountDetailsPage } from '../../../src/ui/pages/AccountDetailsPage';

test.describe('Account Details & Activity', () => {
    test('User can view account details and filter transactions', async ({
        page, user, signUpUser,
    }) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        const detailsPage = new AccountDetailsPage(page);
        await detailsPage.openFirstAccountDetails();
        await detailsPage.filterTransactions(
            '2025-01-01', '2025-12-31'
        );
    });
});
