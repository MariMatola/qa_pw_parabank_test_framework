import { test } from '../../_fixtures/fixtures';
import { 
    signUpFormFields, 
} from '../../../src/ui/constants/signUpFormConstants';
import { generateInvalidUserData } from '../../../src/common/testData/generateNewUser';
import { SignUpPage } from '../../../src/ui/pages/SignUpPage';
import * as allure from 'allure-js-commons';

signUpFormFields.forEach(field => {
    test(
        `User is unable to sign up with empty ${field.name}`,
        async ({user, page}) => {
            await allure.severity('critical');

            const signUpPage = new SignUpPage(page);

            await signUpPage.goToSignUpPage();
            await signUpPage.assertSignUpPageIsLoaded();
            await signUpPage.fillInSignUpForm(user, field.name);
            await signUpPage.clickRegisterButton();
            await signUpPage.assertErrorMessage(field.emptyErrorMessage);
        },
    );
});

// SKIPPED: Parabank does not implement client-side validation for invalid
// data formats (e.g. numbers in name field). The form submits without
// showing the expected error. Re-enable when the app adds these validations.
signUpFormFields.forEach(field => {
    test.skip(
        `User is unable to sign up with invalid ${field.name}`,
        async ({page, user}) => {
            await allure.severity('normal');

            const signUpPage = new SignUpPage(page);
            const invalidUser = generateInvalidUserData(user, field.name);
            await signUpPage.goToSignUpPage();
            await signUpPage.assertSignUpPageIsLoaded();
            await signUpPage.fillInSignUpForm(invalidUser);
            await signUpPage.clickRegisterButton();
            await signUpPage.assertErrorMessage(field.invalidErrorMessage);
        },
    );
});


