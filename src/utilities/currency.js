export function formatCurrency(amount) {
    var decimal = parseInt(amount).toFixed(2);
    var parts = decimal.toString().split(".");
    return "$" + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}
