import { test as genericTest } from './fixturesGeneric';
import { SignUpPage } from '../../src/ui/pages/SignUpPage';
import { ProfilePage } from '../../src/ui/pages/ProfilePage';
import { HomePage } from '../../src/ui/pages/HomePage';

export const test = genericTest.extend<
    {
        signUpUser;
        signInUser;
    }
>({
    signUpUser: async ({ }, use) => {
        const signUp = async (user, page) => {
            const signUpPage = new SignUpPage(page);
            const profilePage = new ProfilePage(page);

            await signUpPage.goToSignUpPage();
            await signUpPage.assertSignUpPageIsLoaded();
            await signUpPage.fillInSignUpForm(user);
            await signUpPage.clickRegisterButton();
            await profilePage.assertUserIsRegistered(user.username);
        };

        await use(signUp);
    },

    signInUser: async ({ }, use) => {
        const signIn = async (user, page) => {
            const homePage = new HomePage(page);
            const profilePage = new ProfilePage(page);
            await homePage.goToHomePage();
            await homePage.assertHomePageIsLoaded();
            await homePage.fillInUsername(user.username);
            await homePage.fillInPassword(user.password);
            await homePage.clickLoginButton();
            await profilePage.assertUserIsLoggedIn(user.firstName, user.lastName);
        };

        await use(signIn);
    },
});

