import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';
import { ApplyForLoanPage } from '../../../src/ui/pages/ApplyForLoanPage';

test.describe('Single account', () => {
    test('The user is able to apply for a loan', async ({
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

        await signUpUser(user, page);
        await profilePage.clickAccountOverviewLink();
        await accountOverviewPage.assertAccountOverviewPageIsLoaded();

        const firstAccountNumber = await accountOverviewPage
            .getAccountNumberFromTheTableRow(0);
        const totalBalance = await accountOverviewPage.getTotalBalance();
        expect(firstAccountNumber).not.toBeNull();
        expect(totalBalance).not.toBeNull();
        let firstAccountBalance = totalBalance;
        const firstAccountAvailableBalance = totalBalance;

        const downPayment = '0';
        await profilePage.clickRequestLoanLink();
        const applyForLoanPage = new ApplyForLoanPage(page);
        await applyForLoanPage.assertApplyForLoanPageIsLoaded();

        await applyForLoanPage.fillInAmountInputField(firstAccountBalance!);
        await applyForLoanPage.fillInDownPaymentInputField(downPayment);
        await applyForLoanPage.selectFromAccountId(firstAccountNumber!);
        await applyForLoanPage.clickApplyNowButton();
        await applyForLoanPage.assertLoanRequestProcessedHeadingIsDisplayed();
    });
});
