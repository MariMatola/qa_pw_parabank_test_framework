import { formatCurrency, parseCurrency } from './stringHelpers';

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
        const newAccountBalance = 90;
        const newAccountAvailableBalance = 90;

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

        await profilePage.clickAccountOverviewLink();
    }

    return {
        updatedFirstAccountBalance,
        updatedFirstAccountAvailableBalance,
        newAccountIds
    };
}