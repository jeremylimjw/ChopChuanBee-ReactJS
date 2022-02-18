import { axiosObject } from "./axiosWrapper";

export class ProductApiHelper {
    static async getById(id) {
        return axiosObject.get(`/product?id=${id}`)
            .then(res => res.data);
    }

    static async get(name, status) {
        let query = '';
        if (name)
            query += `&name_like=${name}`
        if (status === true) {
            query += `&deactivated_date_is_null=1`;
        } else if (status === false) {
            query += `&deactivated_date_is_nn=1`;
        }
        return axiosObject.get(`/product?order_by=created_at_desc${query}`)
            .then(res => res.data);
    }

    static async getOrderByName(name) {
        let query = '';
        if (name)
            query += `&name_like=${name}`
        return axiosObject.get(`/product?deactivated_date_is_null=1&order_by=name${query}`)
            .then(res => res.data);
    }

    static async create(product) {
        return axiosObject.post(`/product`, product)
            .then(res => res.data);
    }

    static async update(product) {
        return axiosObject.put(`/product`, {
            id: product.id, 
            name: product.name, 
            min_inventory_level: product.min_inventory_level, 
            description: product.description, 
            unit: product.unit, 
        })
        .then(res => res.data);
    }

    static async activate(id) {
        return axiosObject.post(`/product/activate`, { id: id })
            .then(res => res.data);
    }

    static async deactivate(id) {
        return axiosObject.post(`/product/deactivate`, { id: id })
            .then(res => res.data);
    }
}