export function formatCurrency(amount) {
    var is_negative = amount < 0;
    var decimal = parseFloat(amount).toFixed(2);
    var parts = decimal.toString().split(".");

    if (is_negative) {
        return `-$${parts[0].substring(1, parts[0].length).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${parts[1] ? "." + parts[1] : ""}`;
    } else {
        return `$${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${parts[1] ? "." + parts[1] : ""}`;
    }
}