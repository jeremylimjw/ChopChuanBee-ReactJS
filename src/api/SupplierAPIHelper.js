import { axiosObject } from "./axiosWrapper";

export class SupplierAPIHelper {
  static async getById(id) {
    return axiosObject.get("/supplier", { params: { id: id } })
      .then((res) => res.data);
  }

  static async get(query) {
    const params = {};
    
    if (query.company_name)
      params.company_name_like = query.company_name;
    if (query.s1_name)
      params.s1_name_like = query.s1_name;
    if (query.status === true) {
      params.deactivated_date_is_null = 1;
    } else if (query.status === false) {
      params.deactivated_date_is_nn = 1;
    }
    if (query.limit)
      params.limit = query.limit;
    params.order_by = 'created_at_desc';

    return axiosObject.get("/supplier", { params })
      .then((res) => res.data);
  }

  static async getAll() {
    const params = {
      order_by: 'created_at_desc'
    };
    return axiosObject.get("/supplier", { params })
      .then((res) => res.data);
  }

  static async create(supplier) {
    return axiosObject
      .post("/supplier", {
        company_name: supplier.company_name,
        s1_name: supplier.s1_name,
        s1_phone_number: supplier.s1_phone_number,
        address: supplier.address,
        postal_code: supplier.postal_code,
        description: supplier.description,
        company_email: supplier.company_email,
        s2_name: supplier.s2_name,
        s2_phone_number: supplier.s2_phone_number,
      })
      .then((res) => res.data)
  }

  static async deactivate(id) {
    return axiosObject.post("/supplier/deactivate", { id: id })
      .then((res) => res.data);
  }

  static async activate(id) {
    return axiosObject.post("/supplier/activate", { id: id })
      .then((res) => res.data);
  }

  static async update(supplier) {
    return axiosObject
      .put("/supplier", {
        id: supplier.id,
        company_name: supplier.company_name,
        s1_name: supplier.s1_name,
        s1_phone_number: supplier.s1_phone_number,
        address: supplier.address,
        postal_code: supplier.postal_code,
        description: supplier.description,
        company_email: supplier.company_email,
        s2_name: supplier.s2_name,
        s2_phone_number: supplier.s2_phone_number,
      })
      .then((res) => res.data)
  }

  static async getMenu(supplierId) {
    const params = {
      supplier_id: supplierId,
      include: 'product',
    }
    return axiosObject
      .get("/supplier/menu", { params: params })
      .then((res) => res.data);
  }

  static async updateMenu(supplierId, menuItems) {
      const newMenu = menuItems.map(x => ({ 
            ...x, 
            supplier_id: supplierId,
            product_id: x.product.id,
        }))
      return axiosObject.put(`/supplier/menu`, {
          supplier_id: supplierId,
          supplier_menus: newMenu,
      })
      .then(res => res.data);
  }
}
