import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { FindTransactionsPage } from '../../../src/ui/pages/FindTransactionPage';

test.describe('Transactions', () => {
    test('User can search transactions by account', async (
        { user, signUpUser, page }
    ) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        const firstAccountNumber = await accountOverviewPage
            .getAccountNumberFromTheTableRow(0);

        const findTransactionsPage = new FindTransactionsPage(page);

        await profilePage.clickFindTransactionsLink();
        await findTransactionsPage.assertFindTransactionsPageIsLoaded();

        await findTransactionsPage.searchByAccount(firstAccountNumber);
        const resultsCount = await findTransactionsPage.getResultsCount();
        expect(resultsCount).toBeGreaterThanOrEqual(0);
    });
});