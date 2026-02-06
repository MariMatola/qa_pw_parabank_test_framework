export function capitalize(str) {
    if (str == null || typeof str !== 'string') {
        return '';
    }
    const firstLetterCap = str.charAt(0).toUpperCase();

    const remainingLetters = str.slice(1);

    return firstLetterCap + remainingLetters;
}

export function camelCaseToPhrase(str) {
    return str.replace(/([A-Z])/g, ' $1');
}

export function parseCurrency(str) {
    if (str == null || typeof str !== 'string') {
        return 0;
    }
    const cleaned = str.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    return Number.isNaN(value) ? 0 : value;
}

export function formatCurrency(num) {
    return `$${num.toFixed(2)}`;
}