import { expect, testStep } from '../../common/helpers/pwHelpers';
import { HomePage } from './HomePage';
import { signUpFormFields } from '../constants/signUpFormConstants';

export class SignUpPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.signUpPageTitle = page
      .getByRole('heading', { name: 'Signing up is easy!' });
    this.registerButton = page.getByRole('button', { name: 'Register' })
  }
  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillInFormField(field, value) {
    await this.step(`Fill in ${field.name}`, async () => {
      await this.page.locator(field.locator).fill(value);
    });
  }

  async fillInSignUpForm(userData, skipFieldName = null) {
    await this.step(`Fill in Sign Up form`, async () => {
      // Map form field names to user data properties
      const fieldMapping = {
        'First Name': userData.firstName,
        'Last Name': userData.lastName,
        'Address': userData.address,
        'City': userData.city,
        'State': userData.state,
        'Zip Code': userData.zipCode,
        'Phone Number': userData.phoneNumber,
        'SSN': userData.ssn,
        'Username': userData.username,
        'Password': userData.password,
        'Confirm Password': userData.confirmPassword,
      };

      for (const field of signUpFormFields) {
        // Skip field if specified (for negative tests)
        if (skipFieldName && field.name === skipFieldName) {
          continue;
        }

        const value = fieldMapping[field.name];
        if (value) {
          await this.fillInFormField(field, value);
        }
      }
    });
  }

  async goToSignUpPage() {
    await this.step(`Go to Sign Up Page`, async () => {
        const homePage = new HomePage(this.page);
        await homePage.goToHomePage();
        await homePage.assertHomePageIsLoaded();
        await homePage.clickRegisterLink();
    });
  }
  async clickRegisterButton() {
    await this.step(`Click Register Button`, async () => {
      await this.registerButton.click();
    });
  }

  async assertSignUpPageIsLoaded() {
    await this.step(`Assert Sign Up Page is Loaded`, async () => {
      await expect(this.signUpPageTitle).toBeVisible();
    });
  }

  async assertErrorMessage(errorMessage) {
    await this.step(`Assert Error Message`, async () => {
      const errorMessageLocator = this.page.getByText(errorMessage);
      await expect(errorMessageLocator).toBeVisible();
    });
  }
}
