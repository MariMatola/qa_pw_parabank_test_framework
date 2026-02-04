import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';

test('User is able to sign up with valid data', async (
    {user, signUpUser, page}
) => {
    await allure.severity('blocker');
    await signUpUser(user, page);
});
