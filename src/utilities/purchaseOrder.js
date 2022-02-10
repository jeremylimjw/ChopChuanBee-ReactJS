export function sumItemSubtotals(purchaseOrder) {
    return purchaseOrder.purchase_order_items.reduce((prev, current) => prev + current.quantity * (current?.unit_cost || 0), 0);
}

export function getOrderTotal(purchaseOrder) {
    const total = sumItemSubtotals(purchaseOrder) * (1+purchaseOrder.gst_rate/100) - purchaseOrder.offset;
    return Math.floor(total*100)/100; // Truncate trailing decimals
}

export function getPayments(purchaseOrder) {
    // Filter out the AP payments
    // Map to flip the negative sign for frontend display
    return purchaseOrder.payments.filter(x => x?.payment_method_id != null).map(x => ({...x, amount: -x.amount })); 
}

export function getPaymentsTotal(purchaseOrder) {
    // Need +current to parse string to number
    return getPayments(purchaseOrder).reduce((prev, current) => prev += +current.amount, 0);
}