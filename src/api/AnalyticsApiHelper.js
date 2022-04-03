import { axiosObject } from "./axiosWrapper";

export class AnalyticsApiHelper {
  static async getCOGS(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/COGS_table/", { params })
      .then((res) => res.data);
  }

  static async getCOGSToday() {
    return axiosObject
      .get("/analytics/COGS_table_today/")
      .then((res) => res.data);
  }

  static async getRevenue(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Revenue_table/", { params })
      .then((res) => res.data);
  }

  static async getRevenueToday() {
    return axiosObject
      .get("/analytics/Revenue_table_today/")
      .then((res) => res.data);
  }

  static async getProfits(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Profits_table/", { params })
      .then((res) => res.data);
  }

  static async getProfitsToday() {
    return axiosObject
      .get("/analytics/Profits_table_today/")
      .then((res) => res.data);
  }

  static async getPayableInvoices() {
    return axiosObject
      .get("/analytics/Unsettled_AP/")
      .then((res) => res.data);
  }

  static async getPayableSuppliers() {
    return axiosObject
      .get("/analytics/Supplier_AP/")
      .then((res) => res.data);
  }

  static async getReceivableInvoices() {
    return axiosObject
      .get("/analytics/Unsettled_AR/")
      .then((res) => res.data);
  }

  static async getReceivableCustomers() {
    return axiosObject
      .get("/analytics/Customer_AR/")
      .then((res) => res.data);
  }

  static async getCustomerProfits(customer_id, start_date, end_date) {
    const params = {};
    params.customer_id = customer_id;
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Customer_Profits/", { params })
      .then((res) => res.data);
  }

  static async getProductAnalytics(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Product_Analytics/", { params })
      .then((res) => res.data);
  }

  static async getAgedReceivable() {
    return axiosObject
      .get("/analytics/Aging_AR_Table/")
      .then((res) => res.data);
  }

  static async getSupplierReturnedGoodsOrderByValueDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Supplier_Returned_Goods/", { params })
      .then((res) => res.data);
  }

  static async getSupplierReturnedGoodsOrderByQtyDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Supplier_Returned_Goods_Qn_Desc/", { params })
      .then((res) => res.data);
  }

  static async getCustomerReturnedGoodsOrderByValueDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Customer_Returned_Goods/", { params })
      .then((res) => res.data);
  }

  static async getCustomerReturnedGoodsOrderByQtyDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Customer_Returned_Goods_Qn_Desc/", { params })
      .then((res) => res.data);
  }

  static async getDamagedGoodsOrderByValueDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Damaged_Goods/", { params })
      .then((res) => res.data);
  }

  static async getDamagedGoodsOrderByQtyDesc(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Damaged_Goods_Qn_Desc/", { params })
      .then((res) => res.data);
  }
}
