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
        if (query?.startDate && query?.endDate) {
          params.created_at_from = query.startDate;
          params.created_at_to = query.endDate;
        }
        if (query?.purchase_order_status_id) {
          params.purchase_order_status_id = query.purchase_order_status_id;
        }
        params.order_by = 'created_at_desc';

        return axiosObject.get(`/purchaseOrder`, { params: params })
            .then(res => res.data);
    }

    static async getAll(from, to) {
        let queryString = "";
        if (from && to) {
            queryString += `&created_at_from=${from.toISOString()}&created_at_to=${to.toISOString()}`;
        }
        return axiosObject.get(`/purchaseOrder?order_by=created_at_desc${queryString}`)
            .then(res => res.data);
    }

    static async getById(id) {
        return axiosObject.get(`/purchaseOrder?id=${id}`)
            .then(res => res.data);
    }
    
    static async update(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, {
            id: purchaseOrder.id,
            has_gst: purchaseOrder.has_gst,
            gst_rate: purchaseOrder.gst_rate,
            offset: purchaseOrder.offset,
            supplier_invoice_id: purchaseOrder.supplier_invoice_id,
            remarks: purchaseOrder.remarks,
            payment_term_id: purchaseOrder.payment_term_id,
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
}
