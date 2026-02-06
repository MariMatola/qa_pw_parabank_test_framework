import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';

test('User is able to sign up with valid data', async ({
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
});
