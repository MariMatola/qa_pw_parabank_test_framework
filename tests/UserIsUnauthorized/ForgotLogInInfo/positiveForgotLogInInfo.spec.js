import { test } from '../../_fixtures/fixtures';
import { ForgotInfoPage } from '../../../src/ui/pages/ForgotInfoPage';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import * as allure from 'allure-js-commons';

test.use({
    contextsNumber: 2,
});
test('User is able to retrieve login info', async ({
    user, pages, signUpUser
}) => {
    await allure.severity('blocker');
    const forgotInfoPage = new ForgotInfoPage(pages[1]);
    const profilePage = new ProfilePage(pages[1]);
    await signUpUser(user, pages[0]);
    await forgotInfoPage.goToForgotInfoPage();
    await forgotInfoPage.assertForgotInfoPageIsLoaded();
    await forgotInfoPage.fillInForgotInfoForm(user);
    await forgotInfoPage.clickFindMyLoginInfoButton();
    await pages[1].waitForTimeout(1000);
    await profilePage.assertUserIsLoggedIn(user.firstName, user.lastName);
    await profilePage.assertCorrectLoginInfo(user.username, user.password);
});