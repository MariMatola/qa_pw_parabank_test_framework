import { PayBillPage } from '../../ui/pages/PayBillPage';
import { ProfilePage } from '../../ui/pages/ProfilePage';

export async function billPay(
    page,
    user,
    toAccountNumber,
    amountToPay,
    fromAccountNumber,
) {
    const payBillPage = new PayBillPage(page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickPayBillLink();
    await payBillPage.assertPayBillPageIsLoaded();
    await payBillPage.fillInBillPayForm(user, toAccountNumber, amountToPay);
    await payBillPage.selectAccountId(fromAccountNumber);
    await payBillPage.clickSendPaymentButton();
    await payBillPage.assertBillPaySuccessfulMessageIsDisplayed();
}