import { axiosObject } from "./axiosWrapper";

export class ChargedUnderApiHelper {
    static async getAvailable() {
        const params = {};
        params.order_by = 'created_at_desc';
        params.deactivated_date_is_null = '';

        return axiosObject.get(`/chargedUnder`, { params: params })
            .then(res => res.data);
    }

    static async get(query) {
        const params = {};
        
        if (query?.id)
          params.id = query.id;
        if (query?.name)
          params.name_like = query.name;
        if (query?.status === true) {
          params.deactivated_date_is_null = 1;
        } else if (query?.status === false) {
          params.deactivated_date_is_nn = 1;
        }

        params.order_by = 'created_at_desc';

        return axiosObject.get(`/chargedUnder`, { params: params })
            .then(res => res.data);
    }

    static async create(chargedUnder) {
        return axiosObject
        .post("/chargedUnder", {
            name: chargedUnder.name,
            gst_rate: chargedUnder.gst_rate,
            address: chargedUnder.address,
            shipping_address: chargedUnder.shipping_address,
            contact_number: chargedUnder.contact_number,
            registration_number: chargedUnder.registration_number,
        })
        .then((res) => res.data)
    }

    static async deactivate(id) {
        return axiosObject.post("/chargedUnder/deactivate", { id: id })
        .then((res) => res.data);
    }

    static async activate(id) {
        return axiosObject.post("/chargedUnder/activate", { id: id })
        .then((res) => res.data);
    }

    static async update(chargedUnder) {
        return axiosObject
        .put("/chargedUnder", {
            id: chargedUnder.id,
            name: chargedUnder.name,
            gst_rate: chargedUnder.gst_rate,
            address: chargedUnder.address,
            shipping_address: chargedUnder.shipping_address,
            contact_number: chargedUnder.contact_number,
            registration_number: chargedUnder.registration_number,
        })
        .then((res) => res.data)
    }

}