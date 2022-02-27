import { PaymentMethod } from "../enums/PaymentMethod";
import { getPaymentTerm, getPaymentTermTag } from "../enums/PaymentTerm";
import { getPurchaseOrderStatus, getPurchaseOrderStatusTag, POStatus } from "../enums/PurchaseOrderStatus";

export class SalesOrder {
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
        return this.sales_order_items?.reduce((prev, current) => prev + current.quantity * (current?.unit_cost || 0), 0) || 0;
    }

    getGstAmount() {
        return this.sumItemSubtotals()*this.gst_rate/100;
    }

    getOrderTotal() {
        if (this.has_gst === 2) {
            const total = this.sumItemSubtotals() + (+this.offset);
            return Math.floor(total*100)/100; // Truncate trailing decimals
        }
        const total = this.sumItemSubtotals() * (1+this.gst_rate/100) + (+this.offset);
        return Math.floor(total*100)/100; // Truncate trailing decimals
    }
    
    getPayments() {
        // Filter out the AR payments
        return this.payments?.filter(x => x.payment_method_id != null) || []; 
    }

    getPaymentsTotal() {
        // Need +current to parse string to number
        return this.getPayments().reduce((prev, current) => prev += +current.amount, 0);
    }

    getPaymentProgress() {
        return Math.round(this.getPaymentsTotal()/this.getOrderTotal()*100);
    }
    
    getStatus() {
        return getPurchaseOrderStatus(this.sales_order_status_id);
    }
    
    getStatusTag() {
        return getPurchaseOrderStatusTag(this.sales_order_status_id);
    }

    isStatus(...args) {
        for (let statusType of args) {
            if (statusType.id === this.sales_order_status_id) {
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
    
}