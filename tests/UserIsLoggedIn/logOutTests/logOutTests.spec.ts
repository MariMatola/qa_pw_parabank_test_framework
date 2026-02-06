import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({
    contextsNumber: 2,
});

test('User is able to log out after signing up', async ({
    user,
    signUpUser,
    page,
}: {
    page: Page;
    user: User;
    signUpUser: (user: User, page: Page) => Promise<void>;
}) => {
    await allure.severity('blocker');
    await signUpUser(user, page);
    const profilePage = new ProfilePage(page);
    const homePage = new HomePage(page);
    await profilePage.clickLogOutLink();
    await homePage.assertUserIsLoggedOut();
});

test('User is able to log out after signing in', async ({
    user,
    signUpUser,
    signInUser,
    pages,
}: {
    user: User;
    signUpUser: (user: User, page: Page) => Promise<void>;
    signInUser: (user: User, page: Page) => Promise<void>;
    pages: Page[];
}) => {
    await allure.severity('critical');
    await signUpUser(user, pages[0]);
    await signInUser(user, pages[1]);
    const profilePage = new ProfilePage(pages[1]);
    const homePage = new HomePage(pages[1]);

    await profilePage.clickLogOutLink();
    await homePage.assertUserIsLoggedOut();
});
