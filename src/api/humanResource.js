import { axiosObject } from "./axiosWrapper";

// Retrieve leaves data from DB
export const getAllLeaves = axiosObject.get('/leaves')
    .then((res) => {
        let leavesDataSrc = res.data.map((value) => {
            value = {
                ...value,
                duration: `From ${value.startDate} to ${value.endDate}`
            }
            return leavesDataSrc
        })
    })