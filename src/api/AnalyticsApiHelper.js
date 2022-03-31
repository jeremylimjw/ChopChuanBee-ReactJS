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

  static async getCOGSCurrMonth() {
    return axiosObject
      .get("/analytics/COGS_table_currentmonth/")
      .then((res) => res.data);
  }

  static async getCOGSPrevMonth() {
    return axiosObject
      .get("/analytics/COGS_table_previousmonth/")
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

  static async getRevenueCurrMonth() {
    return axiosObject
      .get("/analytics/Revenue_table_currentmonth/")
      .then((res) => res.data);
  }

  static async getRevenuePrevMonth() {
    return axiosObject
      .get("/analytics/Revenue_table_previousmonth/")
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

  static async getProfitsCurrMonth() {
    return axiosObject
      .get("/analytics/Profits_table_currentmonth/")
      .then((res) => res.data);
  }

  static async getProfitsPrevMonth() {
    return axiosObject
      .get("/analytics/Profits_table_previousmonth/")
      .then((res) => res.data);
  }

  static async getProfitsToday() {
    return axiosObject
      .get("/analytics/Profits_table_today/")
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
      .get("/analytics/Aging_AR_Table_Test/")
      .then((res) => res.data);
  }

  static async getSupplierReturnedGoods(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Supplier_Returned_Goods/", { params })
      .then((res) => res.data);
  }

  static async getCustomerReturnedGoods(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Customer_Returned_Goods/", { params })
      .then((res) => res.data);
  }

  static async getDamagedGoods(start_date, end_date) {
    const params = {};
    if (start_date && end_date) {
      params.start_date = start_date.toISOString();
      params.end_date = end_date.toISOString();
    }
    return axiosObject
      .get("/analytics/Damaged_Goods/", { params })
      .then((res) => res.data);
  }
}
