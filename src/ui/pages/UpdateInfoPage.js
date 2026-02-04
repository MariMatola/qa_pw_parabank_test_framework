import { expect, testStep } from '../../common/helpers/pwHelpers';
import { updateInfoFormFields } from '../constants/updateInfoFormConstants';

export class UpdateInfoPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.updateInfoPageTitle = page
      .getByRole('heading', { name: 'Update Profile' });
    this.updateProfileButton = page
      .getByRole('button', { name: 'Update Profile' });
    this.successMessage = page
      .getByRole('heading', { name: 'Profile Updated' });
  }
  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillInFormField(field, value) {
    await this.step(`Fill in ${field.name}`, async () => {
      await this.page.locator(field.locator).fill(value);
    });
  }

  async fillInUpdateInfoForm(userData, skipFieldName = null) {
    await this.step(`Fill in Update Info form`, async () => {
      // Map form field names to user data properties
      const fieldMapping = {
        'First Name': userData.firstName,
        'Last Name': userData.lastName,
        'Address': userData.address,
        'City': userData.city,
        'State': userData.state,
        'Zip Code': userData.zipCode,
        'Phone Number': userData.phoneNumber,
      };

      for (const field of updateInfoFormFields) {
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

  async clickUpdateProfileButton() {
    await this.step(`Click Update Profile Button`, async () => {
      await this.updateProfileButton.click();
    });
  }

  async assertUpdateInfoPageIsLoaded() {
    await this.step(`Assert Update Info Page is Loaded`, async () => {
      await expect(this.updateInfoPageTitle).toBeVisible();
    });
  }

  async assertErrorMessage(errorMessage) {
    await this.step(`Assert Error Message`, async () => {
      const errorMessageLocator = this.page.getByText(errorMessage);
      await expect(errorMessageLocator).toBeVisible();
    });
  }
  async assertSuccessMessage() {
    await this.step(`Assert Success Message`, async () => {
      await expect(this.successMessage).toBeVisible();
    });
  }
}
