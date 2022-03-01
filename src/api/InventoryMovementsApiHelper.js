import { axiosObject } from "./axiosWrapper";

export class InventoryMovementsApiHelper {
    // This uses backend request filtering
    static async get(query) {
        return axiosObject.get(`/inventoryMovements`, { params: query })
            .then(res => res.data);
    }
}