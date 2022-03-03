import { axiosObject } from "./axiosWrapper";

export class DeliveryOrderApiHelper {
    static async get(query) {
        const params = {};
        
        if (query?.sales_order_id)
            params.sales_order_id = query?.sales_order_id;
        if (query?.startDate && query?.endDate) {
            params.created_at_from = query.startDate;
            params.created_at_to = query.endDate;
        }
        params.order_by = 'created_at_desc';

        return axiosObject.get(`/deliveryOrder`, { params: params })
            .then(res => res.data);
    }
}
