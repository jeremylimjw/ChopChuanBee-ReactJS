import { axiosObject } from "./axiosWrapper";

export class GeneralApiHelper {
    static async changePassword(old_password, new_password) {
        let result = axiosObject.post('/employee/changePassword', {
                old_password: old_password,
                new_password: new_password})
            .then((res) => { return res.status })
            .catch((err) => { return err.response.data })
        return result;
    }
    
    static async resetPassword(username, email) {
        let result = axiosObject.post('/employee/resetPassword', { 
                username: username, 
                email: email})
            .then((res) => { return res.status })
            .catch((err) => { return err.response.data })
        return result;
    }

    static async updateProfile(id, name, username, email, contact_number, nok_name, nok_number, address, postal_code) {
        let result = axiosObject.put('/employee/profile', { 
                id: id,
                name: name,
                username: username,
                email: email,
                contact_number: contact_number,
                nok_name: nok_name,
                nok_number: nok_number,
                address: address,
                postal_code: postal_code})  
            .then((res) => { return res.status })
            .catch((err) => { return err.response.data })
        return result;
    }

    static async getProfile(id) {
        let result = axiosObject.get('/employee', {params: {id: id}})
            .then((res) => { return res.data })
            .catch((err) => { return err.response.data })
        return result;
    }
}