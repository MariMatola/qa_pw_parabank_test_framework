export function capitalize(str) {
    const firstLetterCap = str.charAt(0).toUpperCase();

    const remainingLetters = str.slice(1);

    return firstLetterCap + remainingLetters;
}

export function camelCaseToPhrase(str) {
    return str.replace(/([A-Z])/g, ' $1');
}

export function parseCurrency(str) {
    const cleaned = str.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
}

export function formatCurrency(num) {
    return `$${num.toFixed(2)}`;
}