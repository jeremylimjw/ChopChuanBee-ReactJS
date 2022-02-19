import { axiosObject } from "./axiosWrapper";

export class LogApiHelper {
    static async get(name, start_date, end_date, view_id) {
        let query = '';
        if (name)
            query += `&employee_name_like=${name}`;
        if (start_date && end_date)
            query += `&created_at_from=${start_date.toISOString()}&created_at_to=${end_date.toISOString()}`;
        if (view_id)
            query += `&view_id=${view_id}`;
        return axiosObject.get(`/log?order_by=created_at_desc&include=employee${query}`)
            .then(res => res.data);
    }
}