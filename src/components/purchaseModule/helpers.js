export const Status = {
    PENDING: { id: 1, name: "Pending", color: "orange" },
    ACCEPTED: { id: 2, name: "Accepted", color: "yellow" },
    CLOSED: { id: 3, name: "Closed", color: "green" },
    REJECTED: { id: 4, name: "Rejected", color: "red" },
    SENT: { id: 5, name: "Sent", color: "geekblue" },
    CANCELLED: { id: 6, name: "Cancelled", color: "red" },
}

export function isStatus(purchaseOrder, ...args) {
    for (let statusType of args) {
        if (statusType.id == purchaseOrder?.purchase_order_status_id) {
            return true;
        }
    }
    return false;
}

export function getStatus(id) {
    const foundKey = Object.keys(Status).filter(key => Status[key].id == id);
    if (foundKey.length > 0) {
        return Status[foundKey];
    }
    return null;
}

export const PaymentTerm = {
    CASH: { id: 1, name: "Cash", color: "green" },
    CREDIT: { id: 2, name: "Credit", color: "blue" },
}

export function isPaymentTerm(purchaseOrder, ...args) {
    for (let statusType of args) {
        if (statusType.id == purchaseOrder?.payment_term_id) {
            return true;
        }
    }
    return false;
}

export function getPaymentTerm(id) {
    const foundKey = Object.keys(PaymentTerm).filter(key => PaymentTerm[key].id == id);
    if (foundKey.length > 0) {
        return PaymentTerm[foundKey];
    }
    return null;
}

export function transformPurchaseOrder(purchaseOrder) {
    return purchaseOrder.map(x => {
        const payments = getPayments(x);
        return {
            ...x, 
            total: getOrderTotal(x), 
            payments: payments,
            payments_total: getPaymentsTotal(payments),
            ...sumInventoryMovements(x),
        }
    })
}

export function sumItemSubtotals(purchaseOrder) {
    return purchaseOrder.purchase_order_items.reduce((prev, current) => prev + current.quantity * (current?.unit_cost || 0), 0);
}

export function getOrderTotal(purchaseOrder) {
    // If GST inclusive, ignore gst_rate
    if (purchaseOrder.has_gst === 2) {
        const total = sumItemSubtotals(purchaseOrder) + +purchaseOrder.offset;
        return Math.floor(total*100)/100; // Truncate trailing decimals
    }
    const total = sumItemSubtotals(purchaseOrder) * (1+purchaseOrder.gst_rate/100) + +purchaseOrder.offset;
    return Math.floor(total*100)/100; // Truncate trailing decimals
}

export function getPayments(purchaseOrder) {
    // Filter out the AP payments
    // Map to flip the negative sign for frontend display
    return purchaseOrder.payments.filter(x => x?.payment_method_id != null).map(x => ({...x, amount: -x.amount })); 
}

export function getPaymentsTotal(payments) {
    // Need +current to parse string to number
    return payments.reduce((prev, current) => prev += +current.amount, 0);
}

export function sumInventoryMovements(purchaseOrder) {
    const data = { quantities_received: 0, quantities_total: 0 };
    purchaseOrder.purchase_order_items.forEach(x => {
        data.quantities_total += x.quantity;
        x.inventory_movements.forEach(y => data.quantities_received += y.quantity);
    })
    return data;
}
