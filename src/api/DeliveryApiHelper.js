import { axiosObject } from "./axiosWrapper";

export class DeliveryApiHelper {
    static async getOrders(params) {
        return axiosObject.get(`/deliveryOrder`, { params: params })
            .then(res => res.data);
    }

    static async getItinerarys(params) {
        return axiosObject.get(`/itinerary`, { params: params })
            .then(res => res.data);
    }

    static async createItinerary(itinerary) {
        return axiosObject.post(`/itinerary`, itinerary)
            .then(res => res.data);
    }

    static async getGeocode(postal_code) {
        return axiosObject.get(`/external/geocode`, { params: { postal_code: postal_code } })
            .then(res => res.data);
    }

}