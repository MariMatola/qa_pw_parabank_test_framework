import { test } from '../../_fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { UpdateInfoPage } from '../../../src/ui/pages/UpdateInfoPage';

test.use({
    usersNumber: 2,
});

test('User is able to update contact info with valid data', async (
    {users, signUpUser, page}
) => {
    await allure.severity('normal');
    await signUpUser(users[0], page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickUpdateContactInfoLink();
    const updateInfoPage = new UpdateInfoPage(page);
    await updateInfoPage.assertUpdateInfoPageIsLoaded();
    await updateInfoPage.fillInUpdateInfoForm(users[1]);
    await updateInfoPage.clickUpdateProfileButton();
    await updateInfoPage.assertSuccessMessage();
});