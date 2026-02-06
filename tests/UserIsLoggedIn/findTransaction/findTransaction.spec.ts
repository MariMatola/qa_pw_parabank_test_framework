import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { transferFunds } from '../../../src/common/helpers/transferFunds';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { AccountDetailsPage } from '../../../src/ui/pages/AccountDetailsPage';
import { FindTransactionsPage } from '../../../src/ui/pages/FindTransactionPage';

test.describe('Transactions', () => {
    test('User can search transactions by transaction ID', async ({
        user,
        signUpUser,
        page,
    }: {
        page: Page;
        user: User;
        signUpUser: (user: User, page: Page) => Promise<void>;
    }) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const accountOverviewPage = new AccountOverviewPage(page);
        const openAccountPage = new OpenAccountPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = await accountOverviewPage
            .getAccountNumberFromTheTableRow(0);
        expect(firstAccountNumber).toBeTruthy();

        await profilePage.clickOpenNewAccountLink();
        await openAccountPage.assertOpenNewAccountPageIsLoaded();
        await openAccountPage.selectAccountType('CHECKING');
        await openAccountPage.selectFromAccountId(firstAccountNumber!);
        await openAccountPage.clickOpenNewAccountButton();
        await openAccountPage.assertAccountOpenedMessageIsDisplayed();

        const secondAccountIdRaw = await openAccountPage.getNewAccountId();
        expect(secondAccountIdRaw).toBeTruthy();
        const secondAccountNumber = secondAccountIdRaw!.trim();

        await transferFunds(
            page,
            '10',
            firstAccountNumber!,
            secondAccountNumber,
        );

        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage.openFirstAccountDetails();

        const accountDetailsPage = new AccountDetailsPage(page);
        const transactionId =
            await accountDetailsPage.getTransactionIdFromRow(0);
        expect(transactionId).toBeTruthy();

        await profilePage.clickFindTransactionsLink();
        const findTransactionsPage = new FindTransactionsPage(page);
        await findTransactionsPage.assertFindTransactionsPageIsLoaded();
        await findTransactionsPage.searchByTransactionId(transactionId!);

        const resultsCount = await findTransactionsPage.getResultsCount();
        expect(resultsCount).toBeGreaterThanOrEqual(1);
    });
});
