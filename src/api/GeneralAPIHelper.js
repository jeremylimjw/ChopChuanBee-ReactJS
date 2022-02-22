import { axiosObject } from "./axiosWrapper";

export class GeneralApiHelper {
    static async changePassword(old_password, new_password) {
        return axiosObject.post('/employee/changePassword', {
            old_password: old_password,
            new_password: new_password
        })
        .then(res => res.data)
    }

    static async resetPassword(username, email) {
        return axiosObject.post('/employee/resetPassword', {
            username: username,
            email: email
        })
        .then(res => res.data)
    }

}