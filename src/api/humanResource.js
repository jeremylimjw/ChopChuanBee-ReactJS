import { axiosObject } from "./axiosWrapper";

export class HRApiHelper {

    static async getAllLeaveAccounts() {
        return axiosObject.get('/employee/leave')
            .then((res) => res.data)
    }





    static async createNewLeaveApplication(leaveApplication) {
        let response = axiosObject.post('/employee/leave/application', leaveApplication)
            .then((res) => { return res })
        return response
    }

    /**
     * 
     * @param {String} id employee ID string 
     * @returns Array of leave accounts of the corresponding employee
     */
    static async getEmployeeLeaveAccounts(id) {
        let result = axiosObject.get('/employee/leave', { params: { employee_id: id } })
            .then((res) => {
                return res.data
            })
        return result
    }

    static async updateEmployeeLeaveAccounts(leaveAccounts) {
        let response = axiosObject.put('/employee/leave', { leave_accounts: leaveAccounts })
            .then((res) => { return res })
        return response
    }


    static async getAllLeaveApplications() {
        let result = axiosObject.get('/employee/leave/application')
            .then((res) => { return res.data })
        return result
    }

    static async getLeaveApplicationByEmployeeId(employeeId) {
        let result = axiosObject.get('/employee/leave/application', { params: { employee_id: employeeId } })
            .then((res) => {
                return res.data
            })
        return result
    }

    static async updateLeaveApplicationStatus(leaveApplications) {
        let response = axiosObject.put('/employee/leave/application', { leave_applications: [leaveApplications] })
            .then((res) => {
                return res
            })
        return response
    }

    static async cancelLeaveApplication(id) {
        let response = axiosObject.delete('/employee/leave/application', { params: { id: id } })
            .then((res) => {
                return res
            })
        return response
    }

    // static async getPublicHolidays() {
    //     let data = {
    //         resource_id: '04a78f5b-2d12-4695-a6cd-d2b072bc93fe'
    //     }
    //     let result = axiosObject.get('https://data.gov.sg/api/action/datastore_search', { params: { data: data } })
    //         .then((res) => console.log(res))
    // }

}
