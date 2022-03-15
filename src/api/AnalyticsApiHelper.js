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

  static async getPayableInvoices() {
    const params = {};
    params.order_by = "sum_desc";
    return axiosObject
      .get("/analytics/Unsettled_AP/", { params })
      .then((res) => res.data);
  }

  static async getPayableSuppliers() {
    const params = {};
    params.order_by = "sum_desc";
    return axiosObject
      .get("/analytics/Supplier_AP/", { params })
      .then((res) => res.data);
  }

  static async getReceivableInvoices() {
    const params = {};
    params.order_by = "sum_desc";
    return axiosObject
      .get("/analytics/Unsettled_AR/", { params })
      .then((res) => res.data);
  }

  static async getReceivableCustomers() {
    const params = {};
    params.order_by = "sum_desc";
    return axiosObject
      .get("/analytics/Customer_AR/", { params })
      .then((res) => res.data);
  }
}
