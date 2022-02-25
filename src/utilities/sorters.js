export function sortByDate(a, b) {
    if (a == null) a = 0;
    if (b == null) b = 0;

    return new Date(a) - new Date(b);
}

export function sortByNumber(a, b) {
    if (a == null) a = 0;
    if (b == null) b = 0;

    return +a - +b;
}

export function sortByString(a, b) {
    if (a == null) a = '-';
    if (b == null) b = '-';
    
    return a.localeCompare(b);
}