import { axiosObject } from "./axiosWrapper";

export class AccountingAPIHelper {

    static async getAllSOFP() {
        const params = {
        };
        return axiosObject.get("/accounting/SOFP", { params })
          .then((res) => res.data);
    }

    static async getSOFPById(id) {
        return axiosObject.get("/accounting/SOFP", { params: { id: id } })
          .then((res) => res.data);
    }

    static async getSOFP(query) {
        const params = {};
        
        if (query.name)
          params.name_like = query.name;
        if (query.start_date && query.end_date)
          params.end_date_from = query.start_date.toISOString();
          params.end_date_to = query.end_date.toISOString();
        if (query.deleted === true) {
          params.deleted_date_is_null = 1;
        } else if (query.deleted === false) {
          params.deleted_date_is_nn = 1;
        }
        params.order_by = 'created_at_desc';
    
        return axiosObject.get("/accounting/SOFP", { params })
          .then((res) => res.data);
    }
    
    static async create(SOFP) {
        return axiosObject
          .post("/accounting/SOFP", {
            name: SOFP.name,
            end_date: SOFP.end_date,
          })
          .then((res) => res.data)
    }

}