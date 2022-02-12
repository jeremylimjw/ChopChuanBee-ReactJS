import { axiosObject } from "./axiosWrapper";

export class PurchaseOrderApiHelper {
    static async create(purchaseOrder) {
        return axiosObject.post(`/purchaseOrder`, purchaseOrder)
            .then(res => res.data);
    }

    static async getAll() {
        return axiosObject.get(`/purchaseOrder`)
            .then(res => res.data);
    }

    static async getById(id) {
        return axiosObject.get(`/purchaseOrder?id=${id}`)
            .then(res => res.data);
    }
    
    static async update(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, purchaseOrder)
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
}
