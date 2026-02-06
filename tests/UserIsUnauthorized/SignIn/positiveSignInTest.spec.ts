import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';

test.use({
    contextsNumber: 2,
});

test('User is able to sign in with valid data', async ({
    user,
    pages,
    signUpUser,
    signInUser,
}: {
    user: User;
    pages: Page[];
    signUpUser: (user: User, page: Page) => Promise<void>;
    signInUser: (user: User, page: Page) => Promise<void>;
}) => {
    await allure.severity('blocker');
    await signUpUser(user, pages[0]);
    await signInUser(user, pages[1]);
});
