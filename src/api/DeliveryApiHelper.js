import { axiosObject } from "./axiosWrapper";

export class DeliveryApiHelper {
    static async getOrders(query) {
        const params = {};
        
        // if (query?.id)
        //   params.id = query.id;
        // if (query?.name)
        //   params.name_like = query.name;
        // if (query?.status === true) {
        //   params.deactivated_date_is_null = 1;
        // } else if (query?.status === false) {
        //   params.deactivated_date_is_nn = 1;
        // }

        params.order_by = 'created_at_desc';

        return axiosObject.get(`/deliveryOrder`, { params: params })
            .then(res => res.data);
    }

    static async getItinerarys(query) {
        const params = {};
        
        // if (query?.id)
        //   params.id = query.id;
        // if (query?.name)
        //   params.name_like = query.name;
        // if (query?.status === true) {
        //   params.deactivated_date_is_null = 1;
        // } else if (query?.status === false) {
        //   params.deactivated_date_is_nn = 1;
        // }

        params.order_by = 'created_at_desc';

        return axiosObject.get(`/itinerary`, { params: params })
            .then(res => res.data);
    }

}