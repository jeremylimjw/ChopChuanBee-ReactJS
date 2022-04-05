import { axiosObject } from "./axiosWrapper";

export class PurchaseOrderApiHelper {
    static async create(purchaseOrder) {
        return axiosObject.post(`/purchaseOrder`, purchaseOrder)
            .then(res => res.data);
    }

    static async get(query) {
        const params = {};
        
        if (query?.id)
            params.id = query?.id;
        if (query?.purchase_order_status_id)
            params.purchase_order_status_id = query.purchase_order_status_id;
        if (query?.payment_term_id)
            params.payment_term_id = query.payment_term_id;
        if (query?.supplier_id)
            params.supplier_id = query?.supplier_id;
        if (query?.supplier_name)
            params.supplier_name = query?.supplier_name;
        if (query?.startDate && query?.endDate) {
            params.start_date = query.startDate;
            params.end_date = query.endDate;
        }

        return axiosObject.get(`/purchaseOrder`, { params: params })
            .then(res => res.data);
    }
    
    static async update(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, {
            id: purchaseOrder.id,
            has_gst: purchaseOrder.has_gst,
            gst_rate: purchaseOrder.gst_rate,
            charged_under_id: purchaseOrder.charged_under_id,
            offset: purchaseOrder.offset,
            supplier_invoice_id: purchaseOrder.supplier_invoice_id,
            remarks: purchaseOrder.remarks,
            payment_term_id: purchaseOrder.payment_term_id,
            payment_method_id: purchaseOrder.payment_method_id,
            purchase_order_items: purchaseOrder.purchase_order_items,
            purchase_order_status_id: purchaseOrder.purchase_order_status_id, 
        })
        .then(res => res.data);
    }
    
    static async updateStatusOnly(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, { 
            id: purchaseOrder.id, 
            purchase_order_status_id: purchaseOrder.purchase_order_status_id 
        })
        .then(res => res.data);
    }
    
    static async closeOrder(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, { 
            id: purchaseOrder.id, 
            purchase_order_status_id: purchaseOrder.purchase_order_status_id, 
            closed_on: purchaseOrder.closed_on
        })
        .then(res => res.data);
    }

    static async createPayment(payment) {
        return axiosObject.post(`/purchaseOrder/payment`, payment)
            .then(res => res.data);
    }

    static async createInventoryMovement(inventoryMovements) {
        return axiosObject.post(`/purchaseOrder/inventory`, { inventory_movements: inventoryMovements })
            .then(res => res.data);
    }
    
    static async sendEmail(id, document) {
        return axiosObject.post(`/purchaseOrder/sendEmail`, { id: id, document: document })
            .then(res => res.data);
    }
}
