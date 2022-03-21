import { PaymentMethod } from "../enums/PaymentMethod";
import { getPaymentTerm, getPaymentTermTag } from "../enums/PaymentTerm";
import { getPurchaseOrderStatus, getPurchaseOrderStatusTag, POStatus } from "../enums/PurchaseOrderStatus";

export class PurchaseOrder {
    constructor(args) {
        Object.assign(this, {...args});

        // Default values
        this.payment_method_id = this.payment_method_id || PaymentMethod.CASH.id;
        this.gst_rate = this.gst_rate || 0;
        // this.payment_term_id = this.payment_term_id || PaymentTerm.CASH.id;
        // this.has_gst = this.has_gst || 1;
    }

    idToString() {
        return this.id?.toString().padStart(8, "0");
    }

    sumItemSubtotals() {
        return this.purchase_order_items?.reduce((prev, current) => prev + current.quantity * (current?.unit_cost || 0), 0) || 0;
    }

    getGstAmount() {
        return this.sumItemSubtotals()*this.gst_rate/100;
    }

    getOrderTotal() {
        if (this.has_gst === 2) { // If GST Inclusive
            const total = this.sumItemSubtotals() + (+this.offset);
            return Math.floor(total*100)/100; // Truncate trailing decimals
        }
        const total = this.sumItemSubtotals() * (1+this.gst_rate/100) + (+this.offset);
        return Math.floor(total*100)/100; // Truncate trailing decimals
    }
    
    getPayments() {
        // Filter out the AP payments
        // Map to flip the negative sign for frontend display
        return this.payments?.filter(x => x.payment_method_id != null).map(x => ({...x, amount: -x.amount })) || []; 
    }

    getPaymentsTotal() {
        // Need +current to parse string to number
        return this.getPayments().reduce((prev, current) => prev += +current.amount, 0);
    }

    getPaymentProgress() {
        return Math.round(this.getPaymentsTotal()/this.getOrderTotal()*100);
    }
    
    getStatus() {
        return getPurchaseOrderStatus(this.purchase_order_status_id);
    }
    
    getStatusTag() {
        return getPurchaseOrderStatusTag(this.purchase_order_status_id);
    }

    isStatus(...args) {
        for (let statusType of args) {
            if (statusType.id === this.purchase_order_status_id) {
                return true;
            }
        }
        return false;
    }
    
    getPaymentTerm() {
        return getPaymentTerm(this.payment_term_id);
    }

    getPaymentTermTag() {
        return getPaymentTermTag(this.payment_term_id)
    }
    
    isPaymentTerm(...args) {
        for (let statusType of args) {
            if (statusType.id === this.payment_term_id) {
                return true;
            }
        }
        return false;
    }

    getTotalQuantities() {
        return this.purchase_order_items.reduce((prev, current) => prev + current.quantity, 0)
    }

    getTotalReceivedQuantities() {
        return this.purchase_order_items.reduce((prev, current) => {
            return prev + current.inventory_movements.reduce((prev2, current2) => prev2 + current2.quantity, 0);
        }, 0)
    }

    getQuantityProgress() {
        return Math.round(this.getTotalReceivedQuantities()/this.getTotalQuantities()*100)
    }

    convertToInvoice() {
        this.purchase_order_status_id = POStatus.ACCEPTED.id;

        if (this.has_gst === 1) { // No GST
            this.gst_rate = 0;
        } else if (this.has_gst === 2) { // GST Inclusive
            // Convert items to GST exclusive
            this.has_gst = 3; // Change to GST exclusive
            this.purchase_order_items = this.purchase_order_items.map(item => ({...item, unit_cost: (item.unit_cost/(1+this.gst_rate/100)) }))
        }
    }
    
}