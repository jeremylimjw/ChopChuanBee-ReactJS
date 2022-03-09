import { axiosObject } from "./axiosWrapper";

export class GeneralApiHelper {
    static async changePassword(old_password, new_password) {
        return axiosObject.post('/employee/changePassword', {
            old_password: old_password,
            new_password: new_password
        })
        .then(res => res.data)
    }

    static async resetPassword(email) {
        return axiosObject.post('/employee/resetPassword', {
            email: email
        })
        .then(res => res.data)
    }

    // This backend route has no role access
    static async getEmployeeByActivationToken(activation_token) {
        return axiosObject.get(`/employee/activateAccount`, { params: { activation_token: activation_token } })
            .then(res => res.data);
    }

    // This backend route has no role access
    static async activateAccount(activation_token, password) {
        return axiosObject.post(`/employee/activateAccount`, { activation_token, password })
            .then(res => res.data);
    }

}