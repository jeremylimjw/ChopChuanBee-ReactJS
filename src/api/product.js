import { axiosObject } from "./axiosWrapper";

export class ProductApiHelper {
    static async getAll() {
        return axiosObject.get(`/product`)
            .then(res => res.data);
    }
    static async getByName(name) {
        return axiosObject.get(`/product?name=${name}`)
            .then(res => res.data);
    }
}