import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { formatCurrency, parseCurrency } from '../../../src/common/helpers/stringHelpers';
import { openMultipleAccounts } from '../../../src/common/helpers/openMultipleAccounts';
import { billPay } from '../../../src/common/helpers/billPay';

test.describe('Single account', () => {
    test(`The user is able to pay the bill to his checking account`, async (
        { user, signUpUser, page }
    ) => {
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
        const amountToPay = String(
            parseCurrency(updatedFirstAccountBalance) / 2
        );
        firstAccountBalance = formatCurrency(
            parseCurrency(updatedFirstAccountBalance) - Number(amountToPay)
        );
        firstAccountAvailableBalance = firstAccountBalance;

        const secondAccountBalance = formatCurrency(
            90 + Number(amountToPay)
        );
        const secondAccountAvailableBalance = secondAccountBalance

        await billPay(
            page,
            user,
            newAccountIds[0],
            amountToPay,
            firstAccountNumber
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

    test(`The user is able to pay the bill to other user's account`, async (
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

        const secondAccountNumber = await accountOverviewPage2
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
        const amountToPay = String(
            parseCurrency(firstTotalBalance) / 2
        );
        await billPay(
            pages[0],
            users[1],
            secondAccountNumber,
            amountToPay,
            firstAccountNumber
        );
        await profilePage1.clickAccountOverviewLink();
        await accountOverviewPage1.assertAccountOverviewPageIsLoaded();
        firstAccountBalance = formatCurrency(
            parseCurrency(firstTotalBalance) - Number(amountToPay)
        );
        secondAccountBalance = formatCurrency(
            parseCurrency(secondTotalBalance) + Number(amountToPay)
        );
        await accountOverviewPage1.assertcorrectDataInTheTableRow(
            0,
            firstAccountBalance,
            firstAccountBalance
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
            secondAccountBalance
        );
    });
});



