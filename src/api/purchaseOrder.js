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
}
