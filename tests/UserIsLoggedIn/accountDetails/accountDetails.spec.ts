import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { AccountDetailsPage } from '../../../src/ui/pages/AccountDetailsPage';

test.describe('Account Details & Activity', () => {
    test('User can view account details and filter transactions', async ({
        page,
        user,
        signUpUser,
    }) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage.openFirstAccountDetails();
        const detailsPage = new AccountDetailsPage(page);
        await detailsPage.filterTransactionsByPeriodAndType('All', 'All');
        const transactionsCount = await detailsPage.getTransactionsCount();
        expect(transactionsCount).toBeGreaterThanOrEqual(0);
    });
});
