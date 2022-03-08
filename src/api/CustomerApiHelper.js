import { axiosObject } from "./axiosWrapper";

export class CustomerApiHelper {
    static async get(company_name, p1_name, status) {
        
        const params = {};
        
        if (company_name)
            params.company_name = company_name;
        if (p1_name)
            params.p1_name = p1_name;
        if (status != null)
            params.status = status;
        
        return axiosObject.get(`/customer`, { params: params })
            .then(res => res.data);
    }

    static async getById(id) {
        return axiosObject.get(`/customer?include=charged_under&id=${id}`)
            .then(res => res.data);
    }

    static async create(customer) {
        return axiosObject.post(`/customer`, customer)
            .then(res => res.data);
    }

    static async update(customer) {
        return axiosObject.put(`/customer`, {
            id: customer.id, 
            company_name: customer.company_name, 
            company_email: customer.company_email, 
            p1_name: customer.p1_name, 
            p1_phone_number: customer.p1_phone_number, 
            p2_name: customer.p2_name, 
            p2_phone_number: customer.p2_phone_number, 
            address: customer.address, 
            postal_code: customer.postal_code, 
            charged_under_id: customer.charged_under_id, 
            gst: customer.gst, 
            gst_show: customer.gst_show, 
            description: customer.description,
        })
            .then(res => res.data);
    }

    static async activate(id) {
        return axiosObject.post(`/customer/activate`, { id: id })
            .then(res => res.data);
    }

    static async deactivate(id) {
        return axiosObject.post(`/customer/deactivate`, { id: id })
            .then(res => res.data);
    }

    static async getMenu(id) {
        return axiosObject.get(`/customer/menu?customer_id=${id}&include=product&order_by=product_alias`)
            .then(res => res.data);
    }

    static async updateMenu(customer_id, menuItems) {
        const newMenu = menuItems.map(x => ({ 
                ...x, 
                customer_id: customer_id,
                product_id: x.product.id,
            }))
        return axiosObject.put(`/customer/menu`, {
            customer_id: customer_id,
            customer_menus: newMenu,
        })
        .then(res => res.data);
    }

    static async getMyLatestPrices(id) {
      return axiosObject.get(`/customer/latestPrice`, { params: { customer_id: id } })
        .then(res => res.data);
    }
  
    static async getMyAccountPayable(id) {
      return axiosObject.get(`/customer/ar`, { params: { customer_id: id } })
        .then(res => res.data);
    }

}