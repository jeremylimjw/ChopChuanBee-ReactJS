import { axiosObject } from "./axiosWrapper";

export class EmployeeApiHelper {
    static async getAllEmployees() {
        let result = axiosObject.get('/employee')
            .then((res) => {
                return res.data
            })
        return result
    }
}

// export const getAllEmployees = axiosObject.get('/employee')
//     .then((res) => {
//         return res
//     })
