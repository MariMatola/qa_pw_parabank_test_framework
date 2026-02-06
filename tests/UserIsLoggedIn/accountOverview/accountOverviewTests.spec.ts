import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';

test('User is able to see Account Overview page after logging in', async ({
    user,
    signUpUser,
    page,
}: {
    page: Page;
    user: User;
    signUpUser: (user: User, page: Page) => Promise<void>;
}) => {
    await allure.severity('normal');
    await signUpUser(user, page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickAccountOverviewLink();
    const accountOverviewPage = new AccountOverviewPage(page);
    await accountOverviewPage.assertAccountOverviewPageIsLoaded();
    await accountOverviewPage.assertAccountsTableIsVisible();
    const rawBalance = await accountOverviewPage.getTotalBalance();
    expect(rawBalance).not.toBeNull();
    const totalBalance = rawBalance!.trim();
    await accountOverviewPage.assertcorrectDataInTheTableRow(
        0,
        totalBalance,
        totalBalance,
    );
    await accountOverviewPage.assertcorrectDataInTheTotalRow(totalBalance);
});
