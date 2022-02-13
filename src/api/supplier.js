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
    static async createSupplierMenu(supplier_menu_items) {
        return axiosObject.post(`/supplier/menu`, { supplier_menu_items: supplier_menu_items })
            .then(res => res.data);
    }
    static async deleteSupplierMenuItem(supplier_id, product_id) {
        return axiosObject.delete(`/supplier/menu?supplier_id=${supplier_id}&product_id=${product_id}`)
            .then(res => res.data);
    }
}