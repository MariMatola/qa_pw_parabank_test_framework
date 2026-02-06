import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ForgotInfoPage } from '../../../src/ui/pages/ForgotInfoPage';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';

test.use({
    contextsNumber: 2,
});

test('User is able to retrieve login info', async ({
    user,
    pages,
    signUpUser,
}: {
    user: User;
    pages: Page[];
    signUpUser: (user: User, page: Page) => Promise<void>;
}) => {
    await allure.severity('blocker');
    const forgotInfoPage = new ForgotInfoPage(pages[1]);
    const profilePage = new ProfilePage(pages[1]);
    await signUpUser(user, pages[0]);
    await forgotInfoPage.goToForgotInfoPage();
    await forgotInfoPage.assertForgotInfoPageIsLoaded();
    await forgotInfoPage.fillInForgotInfoForm(user);
    await forgotInfoPage.clickFindMyLoginInfoButton();
    await pages[1]
        .getByText(`Welcome ${user.firstName} ${user.lastName}`)
        .waitFor({ state: 'visible' });
    await profilePage.assertUserIsLoggedIn(user.firstName, user.lastName);
    await profilePage.assertCorrectLoginInfo(user.username, user.password);
});
