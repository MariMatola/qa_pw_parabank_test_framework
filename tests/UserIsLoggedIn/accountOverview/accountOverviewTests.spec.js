import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { AccountOverviewPage } from '../../../src/ui/pages/AccountOverviewPage';

test('User is able to see Account Overview page after logging in', async (
    { user, signUpUser, page }
) => {
    await allure.severity('normal');
    await signUpUser(user, page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickAccountOverviewLink();
    const accountOverviewPage = new AccountOverviewPage(page);
    await accountOverviewPage.assertAccountOverviewPageIsLoaded();
    await accountOverviewPage.assertAccountsTableIsVisible();
    const totalBalance = (await accountOverviewPage.getTotalBalance()).trim();
    await accountOverviewPage.assertcorrectDataInTheTableRow(
        0, totalBalance, totalBalance
    );
    await accountOverviewPage.assertcorrectDataInTheTotalRow(totalBalance);
});
