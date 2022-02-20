import { axiosObject } from "./axiosWrapper";

export class GeneralApiHelper {
    static async changePassword(old_password, new_password) {
        let result = axiosObject.post('/employee/changePassword', {
            old_password: old_password,
            new_password: new_password
        })
            .then((res) => { return res.status })
            .catch((err) => { return err.response.data })
        return result;
    }

    static async resetPassword(username, email) {
        let result = axiosObject.post('/employee/resetPassword', {
            username: username,
            email: email
        })
            .then((res) => { return res.status })
            .catch((err) => { return err.response.data })
        return result;
    }

    static async updateProfile(profileData) {
        let response = axiosObject.put('/employee/profile', profileData)
            .then((res) => { return res.status })
        return response
    }

    static async getProfile(id) {
        let result = axiosObject.get('/employee', { params: { id: id } })
            .then((res) => { return res.data })
            .catch((err) => { return err.response.data })
        return result;
    }
}