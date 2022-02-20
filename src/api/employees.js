import { axiosObject } from './axiosWrapper';

export class EmployeeApiHelper {
    static async get(query) {
        const params = { order_by: 'created_at_desc' };

        if (query?.id)
            params.id = query.id;
        if (query?.name)
            params.name_like = query.name;
        if (query?.role_id)
            params.role_id = query.role_id;
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

    static async update(id, employee) {
        return axiosObject.put(`/employee`, { 
            id: id,
            name: employee.name,
            email: employee.email,
            contact_number: employee.contact_number,
            nok_name: employee.nok_name,
            nok_number: employee.nok_number,
            address: employee.address,
            postal_code: employee.postal_code,
            role_id: employee.role_id,
        })
        .then(res => res.data);
    }

    static async updateAccessRights(id, accessRights) {
        return axiosObject.put(`/employee/accessRight`, { 
            id: id,
            access_rights: accessRights,
        })
        .then(res => res.data);
    }

    static async activate(id) {
        return axiosObject.post(`/employee/activate`, { id: id })
            .then(res => res.data);
    }

    static async deactivate(id) {
        return axiosObject.post(`/employee/deactivate`, { id: id })
            .then(res => res.data);
    }
}
