import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { OpenAccountPage } from '../../../src/ui/pages/OpenAccountPage';
import { formatCurrency, parseCurrency } from '../../../src/common/helpers/stringHelpers';
import { ApplyForLoanPage } from '../../../src/ui/pages/applyForLoanPage';

test.describe('Single account', () => {
    test(`The user is able to apply for a loan`, async (
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

        const downPayment = '0';
        await profilePage.clickRequestLoanLink();
        const applyForLoanPage = new ApplyForLoanPage(page);
        await applyForLoanPage.assertApplyForLoanPageIsLoaded();

        await applyForLoanPage.fillInAmountInputField(firstAccountBalance);
        await applyForLoanPage.fillInDownPaymentInputField(downPayment);
        await applyForLoanPage.selectFromAccountId(firstAccountNumber);
        await applyForLoanPage.clickApplyNowButton();
        await applyForLoanPage.assertLoanRequestProcessedHeadingIsDisplayed();
    });
});



