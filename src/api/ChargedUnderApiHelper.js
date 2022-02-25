import { axiosObject } from "./axiosWrapper";

export class ChargedUnderApiHelper {
    static async get() {
        const params = {};
        params.order_by = 'created_at_desc';

        return axiosObject.get(`/chargedUnder`, { params: params })
            .then(res => res.data);
    }

}