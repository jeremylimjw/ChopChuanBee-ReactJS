import { axiosObject } from './axiosWrapper';

export class EmployeeApiHelper {
    static async get(query) {
        const params = { order_by: 'created_at_desc' };
        if (query?.id)
            params.id = query.id;
        if (query?.name)
            params.name_like = query.name;
        if (query?.status === true) {
            params.discharge_date_is_null = 1;
        } else if (query?.status === false) {
            params.discharge_date_is_nn = 1;
        }
        return axiosObject.get('/employee', { params: params })
            .then((res) => res.data);
    }

    static async createNewAccount(
        name,
        username,
        email,
        role_id,
        contact_number,
        nok_name,
        nok_number,
        address,
        postal_code,
        send_email,
        access_rights
    ) {
        let result = axiosObject
            .post('/employee', {
                name: name,
                username: username,
                email: email,
                role_id: role_id,
                contact_number: contact_number,
                nok_name: nok_name,
                nok_number: nok_number,
                address: address,
                postal_code: postal_code,
                send_email: send_email,
                access_rights: access_rights,
            })
            .then((res) => {
                // return res.data;
                return res.status;
            })
            .catch((err) => {
                return err.response.data;
            });
        return result;
    }
}

// export const getAllEmployees = axiosObject.get('/employee')
//     .then((res) => {
//         return res
//     })
