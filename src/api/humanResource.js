import { axiosObject } from "./axiosWrapper";

export class HRApiHelper {

    static async getAllLeaveAccounts() {
        return axiosObject.get('/employee/leave')
            .then((res) => res.data)
    }

    static async getLeaveAccountsById(id) {
        return axiosObject.get('/employee/leave', { params: { employee_id: id } })
            .then(res => res.data)
    }

    static async updateEmployeeLeaveAccounts(leaveAccounts) {
        return axiosObject.put('/employee/leave', { leave_accounts: leaveAccounts })
            .then(res => res.data)
    }

    static async createNewLeaveApplication(leaveApplication) {
        return axiosObject.post('/employee/leave/application', leaveApplication)
            .then(res => res.data)
    }

    static async getLeaveApplications(values) {
        const params = {}
        if (values?.employee_id)
            params.employee_id = values.employee_id;
        if (values?.employee_name)
            params.employee_name = values.employee_name;
        if (values?.leave_type_id)
            params.leave_type_id = values.leave_type_id;
        if (values?.leave_status_id)
            params.leave_status_id = values.leave_status_id;
        return axiosObject.get('/employee/leave/application', { params: params })
            .then(res => res.data)
    }

    static async updateLeaveApplication(leaveApplications) {
        return axiosObject.put('/employee/leave/application', { leave_applications: [leaveApplications] })
            .then(res => res.data)
    }

    static async getPublicHolidays() {
        let data = {
            resource_id: '04a78f5b-2d12-4695-a6cd-d2b072bc93fe' // Year 2022
        }
        
        return axiosObject.get('https://data.gov.sg/api/action/datastore_search', { params: data })
            .then(res => res.data)
    }

}
