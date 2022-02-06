import { axiosObject } from './axiosWrapper';

export class EmployeeApiHelper {
    static async getAllEmployees() {
        let result = axiosObject.get('/employee').then((res) => {
            return res.data;
            // console.log(res);
        });
        return result;
    }
}

// export const getAllEmployees = axiosObject.get('/employee')
//     .then((res) => {
//         return res
//     })
