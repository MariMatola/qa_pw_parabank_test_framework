import { faker } from '@faker-js/faker';

export function generateNewUserData(logger = null) {
    const randomNum1 = Math.floor(Math.random() * 100000);
    const randomNum2 = Math.floor(Math.random() * 100000);
    const firstName = `${faker.person.firstName()}${randomNum1}`;
    const lastName = `${faker.person.lastName()}${randomNum2}`;
    const password = faker.internet.password({ length: 12 });
    const username = firstName.toLowerCase() + faker.word.sample();

    const user = {
        firstName,
        lastName,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode('#####'),
        phoneNumber: faker.phone.number('###-###-####'),
        ssn: faker.string.numeric('###-##-####'),
        username,
        password,
        confirmPassword: password,
    };

    if (logger) {
        logger.debug(`Generated new user data: ${JSON.stringify(user)}`);
    }
    return user;
}

export function generateInvalidUserData(userdata, fieldName, logger = null) {
    const invalidData = { ...userdata };

    const fieldConfig = {
        'First Name': { key: 'firstName', value: faker.string.numeric(3) },
        'Last Name': { key: 'lastName', value: faker.string.numeric(3) },
        'Address': { key: 'address', value: faker.string.alphanumeric(5) },
        'City': { key: 'city', value: faker.string.numeric(3) },
        'State': { key: 'state', value: faker.string.alphanumeric(10) },
        'Zip Code': { key: 'zipCode', value: faker.string.numeric(2) },
        'Phone Number': { key: 'phoneNumber', value: faker.string.numeric(5) },
        'SSN': { key: 'ssn', value: faker.string.numeric(5) },
        'Username': { key: 'username', value: faker.string.alphanumeric(2) },
        'Password': { key: 'password', value: faker.string.alphanumeric(3) },
        'Confirm Password': {
            key: 'confirmPassword',
            value: faker.internet.password(),
        },
    };

    const config = fieldConfig[fieldName];
    if (config) {
        invalidData[config.key] = config.value;
    }

    if (fieldName === 'Password') {
        invalidData.confirmPassword = invalidData.password;
    }

    if (logger) {
        logger.debug(`Generated invalid user data for ${fieldName}: `
            + `${JSON.stringify(invalidData)}`);
    }

    return invalidData;
}