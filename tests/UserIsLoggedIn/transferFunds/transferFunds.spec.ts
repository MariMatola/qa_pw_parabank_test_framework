import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { formatCurrency, parseCurrency } from '../../../src/common/helpers/stringHelpers';
import {
    openMultipleAccounts,
    NEW_ACCOUNT_INITIAL_BALANCE,
} from '../../../src/common/helpers/openMultipleAccounts';
import { transferFunds } from '../../../src/common/helpers/transferFunds';

const singleAccountTransferTestData: { accountType: string }[] = [
    { accountType: 'CHECKING' },
    { accountType: 'SAVINGS' },
];

test.describe('Single account', () => {
    singleAccountTransferTestData.forEach(({ accountType }) => {
        test(
            `The user is able to transfer funds to his ${accountType.toLowerCase()} account`,
            async ({
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
                const totalBalance =
                    await accountOverviewPage.getTotalBalance();
                expect(firstAccountNumber).not.toBeNull();
                expect(totalBalance).not.toBeNull();
                let firstAccountBalance = totalBalance;
                let firstAccountAvailableBalance = totalBalance;
                const {
                    updatedFirstAccountBalance,
                    newAccountIds,
                } = await openMultipleAccounts({
                    accountNumber: 1,
                    accountType,
                    profilePage,
                    openAccountPage,
                    firstAccountNumber: firstAccountNumber!,
                    firstAccountBalance,
                    firstAccountAvailableBalance,
                });
                const amountToTransfer = String(
                    parseCurrency(updatedFirstAccountBalance) / 2,
                );
                firstAccountBalance = formatCurrency(
                    parseCurrency(updatedFirstAccountBalance) -
                        Number(amountToTransfer),
                );
                firstAccountAvailableBalance = firstAccountBalance;

                const secondAccountBalance = formatCurrency(
                    NEW_ACCOUNT_INITIAL_BALANCE + Number(amountToTransfer),
                );
                const secondAccountAvailableBalance = secondAccountBalance;

                expect(newAccountIds[0]).not.toBeNull();
                await transferFunds(
                    page,
                    amountToTransfer,
                    firstAccountNumber!,
                    newAccountIds[0]!,
                );
                await profilePage.clickAccountOverviewLink();
                await accountOverviewPage.assertAccountOverviewPageIsLoaded();
                await accountOverviewPage.assertcorrectDataInTheTableRow(
                    0,
                    firstAccountBalance,
                    firstAccountAvailableBalance,
                );
                await accountOverviewPage.assertcorrectDataInTheTableRow(
                    1,
                    secondAccountBalance,
                    secondAccountAvailableBalance,
                );
                await accountOverviewPage.assertcorrectDataInTheTotalRow(
                    totalBalance!,
                );
            },
        );
    });
});

test.describe('Multiple accounts', () => {
    test.use({
        usersNumber: 2,
        contextsNumber: 2,
    });

    test("The user is able to transfer funds to other user's account", async ({
        users,
        signUpUser,
        pages,
    }: {
        users: User[];
        signUpUser: (user: User, page: Page) => Promise<void>;
        pages: Page[];
    }) => {
        await allure.severity('normal');
        const profilePage1 = new ProfilePage(pages[0]);
        const profilePage2 = new ProfilePage(pages[1]);
        const accountOverviewPage1 = new AccountOverviewPage(pages[0]);
        const accountOverviewPage2 = new AccountOverviewPage(pages[1]);

        await signUpUser(users[0], pages[0]);
        await signUpUser(users[1], pages[1]);

        await profilePage2.clickAccountOverviewLink();
        await accountOverviewPage2.assertAccountOverviewPageIsLoaded();

        const secondAccountNumber = await accountOverviewPage2
            .getAccountNumberFromTheTableRow(0);
        const secondTotalBalance =
            await accountOverviewPage2.getTotalBalance();
        let secondAccountBalance = secondTotalBalance;

        await profilePage1.clickAccountOverviewLink();
        await accountOverviewPage1.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = await accountOverviewPage1
            .getAccountNumberFromTheTableRow(0);
        const firstTotalBalance =
            await accountOverviewPage1.getTotalBalance();
        expect(firstAccountNumber).not.toBeNull();
        expect(secondAccountNumber).not.toBeNull();
        expect(firstTotalBalance).not.toBeNull();
        expect(secondTotalBalance).not.toBeNull();
        let firstAccountBalance = firstTotalBalance;
        const amountToTransfer = String(
            parseCurrency(firstTotalBalance!) / 2,
        );

        await transferFunds(
            pages[0],
            amountToTransfer,
            firstAccountNumber!,
            secondAccountNumber!,
        );
        await profilePage1.clickAccountOverviewLink();
        await accountOverviewPage1.assertAccountOverviewPageIsLoaded();
        firstAccountBalance = formatCurrency(
            parseCurrency(firstTotalBalance!) - Number(amountToTransfer),
        );
        secondAccountBalance = formatCurrency(
            parseCurrency(secondTotalBalance!) + Number(amountToTransfer),
        );
        await accountOverviewPage1.assertcorrectDataInTheTableRow(
            0,
            firstAccountBalance,
            firstAccountBalance,
        );
        await accountOverviewPage1.assertcorrectDataInTheTotalRow(
            firstAccountBalance,
        );
        await profilePage2.clickAccountOverviewLink();
        await accountOverviewPage2.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage2.assertcorrectDataInTheTableRow(
            0,
            secondAccountBalance,
            secondAccountBalance,
        );
        await accountOverviewPage2.assertcorrectDataInTheTotalRow(
            secondAccountBalance,
        );
    });
});
