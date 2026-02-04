import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';

test.use({
    contextsNumber: 2,
});
test('User is able to sign in with valid data', async ({
    user, pages, signUpUser, signInUser
}) => {
    await allure.severity('blocker');
    await signUpUser(user, pages[0]);
    await signInUser(user, pages[1]);
});