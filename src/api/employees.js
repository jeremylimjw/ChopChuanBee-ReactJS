import { axiosObject } from "./axiosWrapper";

export class EmployeeApiHelper {
    static async getAllEmployees() {
        let result = axiosObject.get('/employee')
            .then((res) => {
                return res.data
            })
        return result
    }

    static async getEmployeeById(id) {
        let result = axiosObject.get('/employee', { params: { id: id } })
            .then((res) => {
                return res.data
            })
        return result
    }
}

