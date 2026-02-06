import { formatCurrency, parseCurrency } from './stringHelpers';

/** Initial balance for each newly opened account (used by helper and tests). */
export const NEW_ACCOUNT_INITIAL_BALANCE = 90;

export async function openMultipleAccounts({
    accountNumber,
    accountType,
    profilePage,
    openAccountPage,
    firstAccountNumber,
    firstAccountBalance,
    firstAccountAvailableBalance
}) {
    const newAccountIds = [];
    let updatedFirstAccountBalance = firstAccountBalance;
    let updatedFirstAccountAvailableBalance = firstAccountAvailableBalance;

    for (let i = 1; i <= accountNumber; i++) {
        const newAccountBalance = NEW_ACCOUNT_INITIAL_BALANCE;
        const newAccountAvailableBalance = NEW_ACCOUNT_INITIAL_BALANCE;

        await profilePage.clickOpenNewAccountLink();
        await openAccountPage.assertOpenNewAccountPageIsLoaded();
        await openAccountPage.selectAccountType(accountType);
        await openAccountPage.selectFromAccountId(firstAccountNumber);
        await openAccountPage.clickOpenNewAccountButton();
        await openAccountPage.assertAccountOpenedMessageIsDisplayed();

        const newAccountId = await openAccountPage.getNewAccountId();
        newAccountIds.push(newAccountId);

        updatedFirstAccountBalance = formatCurrency(
            parseCurrency(updatedFirstAccountBalance) - newAccountBalance
        );
        updatedFirstAccountAvailableBalance = formatCurrency(
            parseCurrency(updatedFirstAccountAvailableBalance)
            - newAccountAvailableBalance
        );
    }

    return {
        updatedFirstAccountBalance,
        updatedFirstAccountAvailableBalance,
        newAccountIds
    };
}