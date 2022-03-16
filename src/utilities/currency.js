export function formatCurrency(amount) {
    var negative = amount < 0 ? '-' : '';
    var decimal = parseFloat(amount).toFixed(2);
    var parts = decimal.toString().split(".");
    return negative + "$" + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}