import { test } from '../../_fixtures/fixtures';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { faker } from '@faker-js/faker';
import type { User } from '../../../src/common/testData/generateNewUser';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({
    contextsNumber: 2,
});

const signInScenarios: {
    name: string;
    getUsername: (user: User) => string;
    getPassword: (user: User) => string;
    expectedErrorMessage: string;
}[] = [
    {
        name: 'Non-existent username',
        getUsername: () => faker.internet.username(),
        getPassword: (user) => user.password,
        expectedErrorMessage:
            'The username and password could not be verified.',
    },
    {
        name: 'Invalid password',
        getUsername: (user) => user.username,
        getPassword: () => faker.internet.password(),
        expectedErrorMessage:
            'The username and password could not be verified.',
    },
    {
        name: 'Empty username',
        getUsername: () => '',
        getPassword: (user) => user.password,
        expectedErrorMessage: 'Please enter a username and password',
    },
    {
        name: 'Empty password',
        getUsername: (user) => user.username,
        getPassword: () => '',
        expectedErrorMessage: 'Please enter a username and password',
    },
];

signInScenarios.forEach((scenario) => {
    test(
        `User is unable to sign in with ${scenario.name}`,
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

            const homePage = new HomePage(pages[1]);

            await signUpUser(user, pages[0]);
            await homePage.goToHomePage();
            await homePage.assertHomePageIsLoaded();

            const username = scenario.getUsername(user);
            const password = scenario.getPassword(user);

            await homePage.fillInUsername(username);
            await homePage.fillInPassword(password);
            await homePage.clickLoginButton();
            await homePage.assertErrorMessage(scenario.expectedErrorMessage);
        },
    );
});
