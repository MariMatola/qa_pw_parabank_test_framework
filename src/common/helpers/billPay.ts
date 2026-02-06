import type { Page } from '@playwright/test';
import { PayBillPage } from '../../ui/pages/PayBillPage';
import { ProfilePage } from '../../ui/pages/ProfilePage';

export interface BillPayUser {
    firstName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
}

export async function billPay(
    page: Page,
    user: BillPayUser,
    toAccountNumber: string,
    amountToPay: string,
    fromAccountNumber: string,
): Promise<void> {
    const payBillPage = new PayBillPage(page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickPayBillLink();
    await payBillPage.assertPayBillPageIsLoaded();
    await payBillPage.fillInBillPayForm(user, toAccountNumber, amountToPay);
    await payBillPage.selectAccountId(fromAccountNumber);
    await payBillPage.clickSendPaymentButton();
    await payBillPage.assertBillPaySuccessfulMessageIsDisplayed();
}
