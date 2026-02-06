export function capitalize(str: string | null | undefined): string {
    if (str == null || typeof str !== 'string') {
        return '';
    }
    const firstLetterCap = str.charAt(0).toUpperCase();
    const remainingLetters = str.slice(1);
    return firstLetterCap + remainingLetters;
}

export function camelCaseToPhrase(str: string): string {
    return str.replace(/([A-Z])/g, ' $1');
}

export function parseCurrency(str: string | null | undefined): number {
    if (str == null || typeof str !== 'string') {
        return 0;
    }
    const cleaned = str.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    return Number.isNaN(value) ? 0 : value;
}

export function formatCurrency(num: number): string {
    return `$${num.toFixed(2)}`;
}
