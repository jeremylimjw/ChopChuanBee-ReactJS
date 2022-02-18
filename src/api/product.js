import { axiosObject } from "./axiosWrapper";

export class ProductApiHelper {
    static async get(name) {
        let query = '';
        if (name)
            query += `&name_like=${name}`
        return axiosObject.get(`/product?order_by=name${query}`)
            .then(res => res.data);
    }
}