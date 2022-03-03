import { axiosObject } from "./axiosWrapper";

export class SalesOrderApiHelper {
    static async create(salesOrder) {
        return axiosObject.post(`/salesOrder`, salesOrder)
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
        if (query?.sales_order_status_id)
          params.sales_order_status_id = query.sales_order_status_id;
        if (query?.payment_term_id)
            params.payment_term_id = query.payment_term_id;
        if (query?.customer_id)
            params.customer_id = query?.customer_id;
        params.order_by = 'created_at_desc';

        return axiosObject.get(`/salesOrder`, { params: params })
            .then(res => res.data);
    }
    
    static async update(salesOrder) {
        return axiosObject.put(`/salesOrder`, {
            id: salesOrder.id,
            has_gst: salesOrder.has_gst,
            gst_rate: salesOrder.gst_rate,
            show_gst: salesOrder.show_gst,
            charged_under_id: salesOrder.charged_under_id,
            offset: salesOrder.offset,
            remarks: salesOrder.remarks,
            payment_term_id: salesOrder.payment_term_id,
            payment_method_id: salesOrder.payment_method_id,
            sales_order_items: salesOrder.sales_order_items,
            sales_order_status_id: salesOrder.sales_order_status_id, 
            has_delivery: salesOrder.has_delivery,
            delivery_address: salesOrder.delivery_address,
            delivery_postal_code: salesOrder.delivery_postal_code,
            delivery_remarks: salesOrder.delivery_remarks,
        })
        .then(res => res.data);
    }
    
    static async updateStatusOnly(salesOrder) {
        return axiosObject.put(`/salesOrder`, { 
            id: salesOrder.id, 
            sales_order_status_id: salesOrder.sales_order_status_id 
        })
        .then(res => res.data);
    }
    
    static async confirmOrder(salesOrder) {
        return axiosObject.post(`/salesOrder/confirm`, { id: salesOrder.id })
            .then(res => res.data);
    }
    
    static async closeOrder(salesOrder) {
        return axiosObject.put(`/salesOrder`, { 
            id: salesOrder.id, 
            sales_order_status_id: salesOrder.sales_order_status_id, 
            closed_on: salesOrder.closed_on
        })
        .then(res => res.data);
    }

    static async createPayment(payment) {
        return axiosObject.post(`/salesOrder/payment`, payment)
            .then(res => res.data);
    }

    static async createInventoryMovement(inventoryMovements) {
        return axiosObject.post(`/salesOrder/inventory`, { inventory_movements: inventoryMovements })
            .then(res => res.data);
    }

    static async refundInventoryMovement(inventoryMovements) {
        return axiosObject.post(`/salesOrder/inventory/refund`, { inventory_movements: inventoryMovements })
            .then(res => res.data);
    }
}
