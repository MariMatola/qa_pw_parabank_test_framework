import { expect, testStep } from '../../common/helpers/pwHelpers';
import { HomePage } from './HomePage';
import { ForgotLoginInfoFormFields } from '../constants/ForgotLoginInfoFormConstants';

export class ForgotInfoPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.forgotInfoPageTitle = page
      .getByRole('heading', { name: 'Customer Lookup' });
    this.findMyLoginInfoButton = page
    .getByRole('button', { name: 'Find My Login Info' })
  }
  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillInFormField(field, value) {
    await this.step(`Fill in ${field.name}`, async () => {
      await this.page.locator(field.locator).fill(value);
    });
  }

  async fillInForgotInfoForm(userData, skipFieldName = null) {
    await this.step(`Fill in Forgot Info form`, async () => {
      // Map form field names to user data properties
      const fieldMapping = {
        'First Name': userData.firstName,
        'Last Name': userData.lastName,
        'Address': userData.address,
        'City': userData.city,
        'State': userData.state,
        'Zip Code': userData.zipCode,
        'SSN': userData.ssn
      };

      for (const field of ForgotLoginInfoFormFields) {
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

  async goToForgotInfoPage() {
    await this.step(`Go to Forgot Info Page`, async () => {
        const homePage = new HomePage(this.page);
        await homePage.goToHomePage();
        await homePage.assertHomePageIsLoaded();
        await homePage.clickForgotInfoLink();
    });
  }
  async clickFindMyLoginInfoButton() {
    await this.step(`Click Find My Login Info Button`, async () => {
      await this.findMyLoginInfoButton.click();
    });
  }

  async assertForgotInfoPageIsLoaded() {
    await this.step(`Assert Forgot Info Page is Loaded`, async () => {
      await expect(this.forgotInfoPageTitle).toBeVisible();
    });
  }

  async assertErrorMessage(errorMessage) {
    await this.step(`Assert Error Message`, async () => {
      const errorMessageLocator = this.page.getByText(errorMessage);
      await expect(errorMessageLocator).toBeVisible();
    });
  }
}
