import { test } from '../../_fixtures/fixtures';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { HomePage } from '../../../src/ui/pages/HomePage';
import * as allure from 'allure-js-commons';

test.use({
    contextsNumber: 2,
});

test('User is able to log out after signing up', async ({
    user, signUpUser, page
}) => {
    await allure.severity('blocker');
    await signUpUser(user, page);
    const profilePage = new ProfilePage(page);
    const homePage = new HomePage(page);
    await profilePage.clickLogOutLink();
    await homePage.assertUserIsLoggedOut();
});

test('User is able to log out after signing in', async ({
    user, signUpUser, signInUser, pages
}) => {
    await allure.severity('critical');
    await signUpUser(user, pages[0]);
    await signInUser(user, pages[1]);
    const profilePage = new ProfilePage(pages[1]);
    const homePage = new HomePage(pages[1]);

    await profilePage.clickLogOutLink();
    await homePage.assertUserIsLoggedOut();
});