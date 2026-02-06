import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { formatCurrency } from '../../../src/common/helpers/stringHelpers';
import {
    openMultipleAccounts,
    NEW_ACCOUNT_INITIAL_BALANCE,
} from '../../../src/common/helpers/openMultipleAccounts';

const parametrizedTestData: { accountType: string; accountNumber: number }[] = [
    { accountType: 'CHECKING', accountNumber: 1 },
    { accountType: 'CHECKING', accountNumber: 2 },
    { accountType: 'CHECKING', accountNumber: 3 },
    { accountType: 'SAVINGS', accountNumber: 1 },
    { accountType: 'SAVINGS', accountNumber: 2 },
    { accountType: 'SAVINGS', accountNumber: 3 },
];

parametrizedTestData.forEach(({ accountType, accountNumber }) => {
    test(`User is able to open ${accountNumber} ${accountType} account`, async ({
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
        const openAccountPage = new OpenAccountPage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = await accountOverviewPage
            .getAccountNumberFromTheTableRow(0);
        const totalBalance = await accountOverviewPage.getTotalBalance();
        expect(firstAccountNumber).not.toBeNull();
        expect(totalBalance).not.toBeNull();
        let firstAccountBalance = totalBalance;
        let firstAccountAvailableBalance = totalBalance;

        const {
            updatedFirstAccountBalance,
            updatedFirstAccountAvailableBalance,
            newAccountIds,
        } = await openMultipleAccounts({
            accountNumber,
            accountType,
            profilePage,
            openAccountPage,
            firstAccountNumber: firstAccountNumber!,
            firstAccountBalance,
            firstAccountAvailableBalance,
        });

        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage.assertcorrectDataInTheTableRow(
            0,
            updatedFirstAccountBalance,
            updatedFirstAccountAvailableBalance,
        );
        for (let i = 1; i <= accountNumber; i++) {
            await accountOverviewPage.assertcorrectDataInTheTableRow(
                i,
                formatCurrency(NEW_ACCOUNT_INITIAL_BALANCE),
                formatCurrency(NEW_ACCOUNT_INITIAL_BALANCE),
                newAccountIds[i - 1],
            );
        }
        await accountOverviewPage.assertcorrectDataInTheTotalRow(totalBalance!);
    });
});
