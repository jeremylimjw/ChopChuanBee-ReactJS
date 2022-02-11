import { Status } from "../components/purchaseModule/helpers";
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
    
    static async cancelOrder(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, { id: purchaseOrder.id, purchase_order_status_id: Status.CANCELLED.id })
            .then(res => res.data);
    }
    
    static async closeOrder(purchaseOrder) {
        return axiosObject.put(`/purchaseOrder`, { id: purchaseOrder.id, purchase_order_status_id: Status.CLOSED.id })
            .then(res => res.data);
    }
}
