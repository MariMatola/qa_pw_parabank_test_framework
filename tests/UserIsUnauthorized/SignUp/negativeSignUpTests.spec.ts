import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
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

// Invalid-format tests (e.g. numbers in name field) are not added because
// Parabank does not implement client-side validation; the form submits
// without showing the expected error.
