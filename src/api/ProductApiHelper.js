import { axiosObject } from "./axiosWrapper";

export class ProductApiHelper {
    static async getById(id) {
        return axiosObject.get(`/product`, { params: { id: id } })
            .then(res => res.data);
    }

    static async get(name, status) {
        return axiosObject.get(`/product`, { params: { name, status } })
            .then(res => res.data);
    }

    static async getAllAvailable(name) {
        return axiosObject.get(`/product`, { params: { name, status: true } })
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

    static async getLatestPrices(id) {
        return axiosObject.get(`/product/latestPrice`, { params: { id: id } })
            .then(res => res.data);
    }

    static async getInventoryMovements(id) {
        const params = {
            product_id: id,
            order_by: 'created_at_desc',
        }

        return axiosObject.get(`/product/inventoryMovement`, { params: params })
            .then(res => res.data);
    }

    static async createDamagedInventory(product_id, quantity) {
        return axiosObject.post(`/product/inventoryMovement`, { product_id: product_id, quantity: quantity })
            .then(res => res.data);
    }
}