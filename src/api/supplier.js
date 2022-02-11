import { axiosObject } from "./axiosWrapper";

export class SupplierApiHelper {
    static async getByName(name) {
        return axiosObject.get(`/supplier?company_name=${name}`)
            .then(res => res.data);
    }
    static async getAll() {
        return axiosObject.get(`/supplier`)
            .then(res => res.data);
    }
    static async getSupplierMenu(supplierId) {
        return axiosObject.get(`/supplier/menu?supplier_id=${supplierId}`)
            .then(res => res.data);
    }
}