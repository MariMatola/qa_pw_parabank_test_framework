export interface SignUpFormField {
    name: string;
    locator: string;
    emptyErrorMessage: string;
    invalidErrorMessage: string;
}

export const signUpFormFields: SignUpFormField[] = [
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
    {
        name: 'SSN',
        locator: '[id="customer.ssn"]',
        emptyErrorMessage: 'Social Security Number is required',
        invalidErrorMessage: 'Social Security Number is invalid',
    },
    {
        name: 'Username',
        locator: '[id="customer.username"]',
        emptyErrorMessage: 'Username is required',
        invalidErrorMessage: 'Username is invalid',
    },
    {
        name: 'Password',
        locator: '[id="customer.password"]',
        emptyErrorMessage: 'Password is required',
        invalidErrorMessage: 'Password is invalid',
    },
    {
        name: 'Confirm Password',
        locator: '#repeatedPassword',
        emptyErrorMessage: 'Password confirmation is required',
        invalidErrorMessage: 'Passwords did not match',
    },
];
