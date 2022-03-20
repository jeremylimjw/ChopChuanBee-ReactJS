import { axiosObject } from "./axiosWrapper";

export class DeliveryApiHelper {
    static async getOrders(params) {
        return axiosObject.get(`/deliveryOrder`, { params: params })
            .then(res => res.data);
    }

    static async updateOrder(deliveryOrder) {
        return axiosObject.put(`/deliveryOrder`, { ...deliveryOrder })
            .then(res => res.data);
    }

    static async deleteOrder(id) {
        return axiosObject.delete(`/deliveryOrder`, { params: { id: id }})
            .then(res => res.data);
    }

    static async completeOrder(id) {
        return axiosObject.post(`/deliveryOrder/complete`, { id: id })
            .then(res => res.data);
    }

    static async getItinerarys(params) {
        return axiosObject.get(`/itinerary`, { params: params })
            .then(res => res.data);
    }

    static async createOrder(deliveryOrder) {
        return axiosObject.post(`/deliveryOrder`, deliveryOrder)
            .then(res => res.data);
    }

    static async createItinerary(itinerary) {
        return axiosObject.post(`/itinerary`, itinerary)
            .then(res => res.data);
    }

    static async updateItinerary(itinerary) {
        return axiosObject.put(`/itinerary`, itinerary)
            .then(res => res.data);
    }

    static async deleteItinerary(id) {
        return axiosObject.delete(`/itinerary`, { params: { id: id }})
            .then(res => res.data);
    }

    static async getGeocode(postal_code) {
        return axiosObject.get(`/external/geocode`, { params: { postal_code: postal_code } })
            .then(res => res.data);
    }

    static async optimizeRoutes(origin, waypoints) {
        return axiosObject.post(`/external/optimizeRoutes`, { origin: origin, waypoints: waypoints })
            .then(res => res.data);
    }

}