import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import type { User } from '../../../src/common/testData/generateNewUser';
import { generateInvalidUserData } from '../../../src/common/testData/generateNewUser';
import { ForgotInfoPage } from '../../../src/ui/pages/ForgotInfoPage';
import { ForgotLoginInfoFormFields } from '../../../src/ui/constants/forgotLoginInfoFormConstants';

test.use({
    contextsNumber: 2,
});

// Test with empty fields
ForgotLoginInfoFormFields.forEach((field) => {
    test(
        `User is unable to retrieve login info with empty ${field.name}`,
        async ({
            user,
            pages,
            signUpUser,
        }: {
            user: User;
            pages: Page[];
            signUpUser: (user: User, page: Page) => Promise<void>;
        }) => {
            await allure.severity('critical');

            const forgotInfoPage = new ForgotInfoPage(pages[1]);

            await signUpUser(user, pages[0]);
            await forgotInfoPage.goToForgotInfoPage();
            await forgotInfoPage.assertForgotInfoPageIsLoaded();
            await forgotInfoPage.fillInForgotInfoForm(user, field.name);
            await forgotInfoPage.clickFindMyLoginInfoButton();
            await forgotInfoPage.assertErrorMessage(field.emptyErrorMessage);
        },
    );
});

// Test with invalid fields
ForgotLoginInfoFormFields.forEach((field) => {
    test(
        `User is unable to retrieve login info with invalid ${field.name}`,
        async ({
            pages,
            user,
            signUpUser,
        }: {
            user: User;
            pages: Page[];
            signUpUser: (user: User, page: Page) => Promise<void>;
        }) => {
            await allure.severity('normal');

            const forgotInfoPage = new ForgotInfoPage(pages[1]);
            await signUpUser(user, pages[0]);
            const invalidUser = generateInvalidUserData(user, field.name);

            await forgotInfoPage.goToForgotInfoPage();
            await forgotInfoPage.assertForgotInfoPageIsLoaded();
            await forgotInfoPage.fillInForgotInfoForm(invalidUser);
            await forgotInfoPage.clickFindMyLoginInfoButton();
            await forgotInfoPage.assertErrorMessage(
                'The customer information provided could not be found.',
            );
        },
    );
});
