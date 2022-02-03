import { axiosObject } from "./axiosWrapper";

export class HRApiHelper {

    static async getAllLeaves() {
        axiosObject.get('/application')
            .then((res) => console.log(res))
    }

}



// Retrieve leaves data from DB
// export const getAllLeaves = axiosObject.get('/application')
//     .then((res) => {
//         console.log(res)
//         // let leavesDataSrc = res.data.map((value) => {
//         //     value = {
//         //         ...value,
//         //         duration: `From ${value.startDate} to ${value.endDate}`
//         //     }
//         //     return leavesDataSrc
//         // })
//     })