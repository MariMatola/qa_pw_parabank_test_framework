import type { Page } from '@playwright/test';
import { TransferFundsPage } from '../../ui/pages/TransferFundsPage';
import { ProfilePage } from '../../ui/pages/ProfilePage';

export async function transferFunds(
    page: Page,
    amountToTransfer: string,
    firstAccountNumber: string,
    secondAccountNumber: string,
): Promise<void> {
    const transferFundsPage = new TransferFundsPage(page);
    const profilePage = new ProfilePage(page);
    await profilePage.clickTransferFundsLink();
    await transferFundsPage.assertTransferFundsPageIsLoaded();
    await transferFundsPage.fillAmountInputField(amountToTransfer);
    await transferFundsPage.selectFromAccountId(firstAccountNumber);
    await transferFundsPage.selectToAccountId(secondAccountNumber);
    await transferFundsPage.clickTransferButton();
    await transferFundsPage.assertTransferSuccessfulMessageIsDisplayed();
}
