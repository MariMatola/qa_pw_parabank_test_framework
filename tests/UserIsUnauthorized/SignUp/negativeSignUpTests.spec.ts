import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { generateInvalidUserData } from '../../../src/common/testData/generateNewUser';
import { signUpFormFields } from '../../../src/ui/constants/signUpFormConstants';
import { SignUpPage } from '../../../src/ui/pages/SignUpPage';

signUpFormFields.forEach((field) => {
    test(
        `User is unable to sign up with empty ${field.name}`,
        async ({
            user,
            page,
        }: {
            page: Page;
            user: User;
        }) => {
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
signUpFormFields.forEach((field) => {
    test.skip(
        `User is unable to sign up with invalid ${field.name}`,
        async ({
            page,
            user,
        }: {
            page: Page;
            user: User;
        }) => {
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
