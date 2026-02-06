import { test } from '../../_fixtures/fixtures';
import { updateInfoFormFields } from '../../../src/ui/constants/updateInfoFormConstants';
import * as allure from 'allure-js-commons';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { UpdateInfoPage } from '../../../src/ui/pages/UpdateInfoPage';

test.use({
    usersNumber: 2,
});

// Test with empty fields
updateInfoFormFields.forEach(field => {
    test(
        `User is unable to update contact info with empty ${field.name}`,
        async ({users, signUpUser, page}) => {
            await allure.severity('normal');

            const updateInfoPage = new UpdateInfoPage(page);
            const profilePage = new ProfilePage(page);

            await signUpUser(users[0], page);
            await profilePage.clickUpdateContactInfoLink();
            await updateInfoPage.assertUpdateInfoPageIsLoaded();
            await updateInfoPage.fillInUpdateInfoForm(users[1], field.name);
            await updateInfoPage.clickUpdateProfileButton();
            await updateInfoPage.assertErrorMessage(field.emptyErrorMessage);
        },
    );
});
