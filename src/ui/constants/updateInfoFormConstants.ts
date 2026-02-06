export interface UpdateInfoFormField {
    name: string;
    locator: string;
    emptyErrorMessage: string;
    invalidErrorMessage: string;
}

export const updateInfoFormFields: UpdateInfoFormField[] = [
    {
        name: 'First Name',
        locator: '[id="customer.firstName"]',
        emptyErrorMessage: 'First name is required',
        invalidErrorMessage: 'First name is invalid',
    },
    {
        name: 'Last Name',
        locator: '[id="customer.lastName"]',
        emptyErrorMessage: 'Last name is required',
        invalidErrorMessage: 'Last name is invalid',
    },
    {
        name: 'Address',
        locator: '[id="customer.address.street"]',
        emptyErrorMessage: 'Address is required',
        invalidErrorMessage: 'Address is invalid',
    },
    {
        name: 'City',
        locator: '[id="customer.address.city"]',
        emptyErrorMessage: 'City is required',
        invalidErrorMessage: 'City is invalid',
    },
    {
        name: 'State',
        locator: '[id="customer.address.state"]',
        emptyErrorMessage: 'State is required',
        invalidErrorMessage: 'State is invalid',
    },
    {
        name: 'Zip Code',
        locator: '[id="customer.address.zipCode"]',
        emptyErrorMessage: 'Zip Code is required',
        invalidErrorMessage: 'Zip Code is invalid',
    },
    {
        name: 'Phone Number',
        locator: '[id="customer.phoneNumber"]',
        emptyErrorMessage: 'Phone number is required',
        invalidErrorMessage: 'Phone number is invalid',
    },
];
