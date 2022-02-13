import { axiosObject } from "./axiosWrapper";

export class ProductApiHelper {
    static async getAll() {
        return axiosObject.get(`/product`)
            .then(res => res.data);
    }
    static async searchByName(name) {
        return axiosObject.get(`/product?name_like=${name}`)
            .then(res => res.data);
    }
}