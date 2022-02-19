import { axiosObject } from './axiosWrapper';

export class EmployeeApiHelper {
    static async getAllEmployees() {
        let result = axiosObject.get('/employee').then((res) => {
            return res.data;
        });
        return result;
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
