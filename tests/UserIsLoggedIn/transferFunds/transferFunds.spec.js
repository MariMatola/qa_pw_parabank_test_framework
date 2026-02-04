import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { formatCurrency, parseCurrency } from '../../../src/common/helpers/stringHelpers';
import { openMultipleAccounts } from '../../../src/common/helpers/openMultipleAccounts';
import { transferFunds } from '../../../src/common/helpers/transferFunds';

test.describe('Single account', () => {
    test(`The user is able to transfer funds to his checking account`, async (
        { user, signUpUser, page }
    ) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const openAccountPage = new OpenAccountPage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = accountOverviewPage
            .getAccountNumberFromTheTableRow(0);
        const totalBalance = await accountOverviewPage.getTotalBalance();
        let firstAccountBalance = totalBalance;
        let firstAccountAvailableBalance = totalBalance;
        const {
            updatedFirstAccountBalance,
            updatedFirstAccountAvailableBalance,
            newAccountIds
        } =
            await openMultipleAccounts({
                accountNumber: 1,
                accountType: 'CHECKING',
                profilePage,
                openAccountPage,
                firstAccountNumber,
                firstAccountBalance,
                firstAccountAvailableBalance
            });
        const amountToTransfer = String(
            parseCurrency(updatedFirstAccountBalance) / 2
        );
        firstAccountBalance = formatCurrency(
            parseCurrency(updatedFirstAccountBalance) - Number(amountToTransfer)
        );
        firstAccountAvailableBalance = firstAccountBalance;

        const secondAccountBalance = formatCurrency(
            90 + Number(amountToTransfer)
        );
        const secondAccountAvailableBalance = secondAccountBalance

        await transferFunds(
            page, amountToTransfer, firstAccountNumber, newAccountIds[0]
        );
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage.assertcorrectDataInTheTableRow(
            0,
            firstAccountBalance,
            firstAccountAvailableBalance
        );
        await accountOverviewPage.assertcorrectDataInTheTableRow(
            1,
            secondAccountBalance,
            secondAccountAvailableBalance
        );
        await accountOverviewPage.assertcorrectDataInTheTotalRow(
            totalBalance
        );
    });

    test(`The user is able to transfer funds to his savings account`, async (
        { user, signUpUser, page }
    ) => {
        await allure.severity('normal');
        const profilePage = new ProfilePage(page);
        const openAccountPage = new OpenAccountPage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = accountOverviewPage
            .getAccountNumberFromTheTableRow(0);
        const totalBalance = await accountOverviewPage.getTotalBalance();
        let firstAccountBalance = totalBalance;
        let firstAccountAvailableBalance = totalBalance;
        const {
            updatedFirstAccountBalance,
            updatedFirstAccountAvailableBalance,
            newAccountIds
        } =
            await openMultipleAccounts({
                accountNumber: 1,
                accountType: 'SAVINGS',
                profilePage,
                openAccountPage,
                firstAccountNumber,
                firstAccountBalance,
                firstAccountAvailableBalance
            });
        const amountToTransfer = String(
            parseCurrency(updatedFirstAccountBalance) / 2
        );
        firstAccountBalance = formatCurrency(
            parseCurrency(updatedFirstAccountBalance) - Number(amountToTransfer)
        );
        firstAccountAvailableBalance = firstAccountBalance;

        const secondAccountBalance = formatCurrency(
            90 + Number(amountToTransfer)
        );
        const secondAccountAvailableBalance = secondAccountBalance
        await transferFunds(
            page, amountToTransfer, firstAccountNumber, newAccountIds[0]
        );
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage.assertcorrectDataInTheTableRow(
            0,
            firstAccountBalance,
            firstAccountAvailableBalance
        );
        await accountOverviewPage.assertcorrectDataInTheTableRow(
            1,
            secondAccountBalance,
            secondAccountAvailableBalance
        );
        await accountOverviewPage.assertcorrectDataInTheTotalRow(
            totalBalance
        );
    });
});

test.describe('Multiple accounts', () => {
    test.use({
        usersNumber: 2,
        contextsNumber: 2
    });

    test(`The user is able to transfer funds to other user's account`, async (
        { users, signUpUser, pages }
    ) => {
        await allure.severity('normal');
        const profilePage1 = new ProfilePage(pages[0]);
        const profilePage2 = new ProfilePage(pages[1]);
        const accountOverviewPage1 = new AccountOverviewPage(pages[0]);
        const accountOverviewPage2 = new AccountOverviewPage(pages[1]);

        await signUpUser(users[0], pages[0]);
        await signUpUser(users[1], pages[1]);

        await profilePage2.clickAccountOverviewLink();
        await accountOverviewPage2.assertAccountOverviewPageIsLoaded();

        const secondAccountNumber = accountOverviewPage2
            .getAccountNumberFromTheTableRow(0);
        const secondTotalBalance = await accountOverviewPage2
            .getTotalBalance();
        let secondAccountBalance = secondTotalBalance;

        await profilePage1.clickAccountOverviewLink();
        await accountOverviewPage1.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = await accountOverviewPage1
            .getAccountNumberFromTheTableRow(0);
        let firstTotalBalance = await accountOverviewPage1
            .getTotalBalance();
        let firstAccountBalance = firstTotalBalance;
        const amountToTransfer = String(
            parseCurrency(firstTotalBalance) / 2
        );

        await transferFunds(
            pages[0], amountToTransfer, firstAccountNumber, secondAccountNumber
        );
        await profilePage1.clickAccountOverviewLink();
        await accountOverviewPage1.assertAccountOverviewPageIsLoaded();
        firstAccountBalance = formatCurrency(
            parseCurrency(firstTotalBalance) - Number(amountToTransfer)
        );
        secondAccountBalance = formatCurrency(
            parseCurrency(secondTotalBalance) + Number(amountToTransfer)
        );
        await accountOverviewPage1.assertcorrectDataInTheTableRow(
            0,
            firstAccountBalance,
            secondAccountBalance
        );
        await accountOverviewPage1.assertcorrectDataInTheTotalRow(
            firstAccountBalance
        );
        await profilePage2.clickAccountOverviewLink();
        await accountOverviewPage2.assertAccountOverviewPageIsLoaded();
        await accountOverviewPage2.assertcorrectDataInTheTableRow(
            0,
            secondAccountBalance,
            secondAccountBalance
        );
        await accountOverviewPage2.assertcorrectDataInTheTotalRow(
            firstAccountBalance
        );
    });
});



