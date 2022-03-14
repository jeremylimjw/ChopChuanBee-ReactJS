import { axiosObject } from "./axiosWrapper";

export class AccountingAPIHelper {
  static async getAllBalanceSheets() {
    const params = {
      order_by: "created_at_desc",
    };
    return axiosObject
      .get("/accounting/SOFP", { params })
      .then((res) => res.data);
  }

  static async getBalanceSheetById(id) {
    return axiosObject
      .get("/accounting/SOFP", { params: { id: id } })
      .then((res) => res.data);
  }

  static async getBalanceSheet(query, start_date, end_date, status) {
    const params = {};

    if (query?.name) params.name_like = query.name;
    if (start_date && end_date) {
      params.end_date_from = start_date.toISOString();
      params.end_date_to = end_date.toISOString();
    }
    if (status === true) {
      params.deleted_date_is_null = 1;
    } else if (status === false) {
      params.deleted_date_is_nn = 1;
    }
    params.order_by = "created_at_desc";

    return axiosObject
      .get("/accounting/SOFP", { params })
      .then((res) => res.data);
  }

  static async createBalanceSheet(SOFP) {
    return axiosObject
      .post("/accounting/SOFP", {
        name: SOFP.name,
        end_date: SOFP.end_date,
        remarks: SOFP.remarks,
      })
      .then((res) => res.data);
  }

  static async deactivateBalanceSheet(id) {
    return axiosObject
      .post("/accounting/SOFP/deactivate", { id: id })
      .then((res) => res.data);
  }

  static async activateBalanceSheet(id) {
    return axiosObject
      .post("/accounting/SOFP/activate", { id: id })
      .then((res) => res.data);
  }

  static async updateBalanceSheet(sofp) {
    return axiosObject
      .put("/accounting/SOFP", {
        id: sofp.id,
        name: sofp.name,
        cash_sales_of_goods: sofp.cash_sales_of_goods,
        cash_others: sofp.cash_others,
        account_receivable: sofp.account_receivable,
        inventory: sofp.inventory,
        supplies: sofp.supplies,
        prepaid_insurance: sofp.prepaid_insurance,
        prepaid_rent: sofp.prepaid_rent,
        other_current_asset_1: sofp.other_current_asset_1,
        other_current_asset_2: sofp.other_current_asset_2,
        land: sofp.land,
        less_accumulated_depreciation_land:
          sofp.less_accumulated_depreciation_land,
        building: sofp.building,
        less_accumulated_depreciation_building:
          sofp.less_accumulated_depreciation_building,
        equipments: sofp.equipments,
        less_accumulated_depreciation_equipments:
          sofp.less_accumulated_depreciation_equipments,
        other_non_current_asset_1: sofp.other_non_current_asset_1,
        other_non_current_asset_2: sofp.other_non_current_asset_2,
        goodwill: sofp.goodwill,
        trade_names: sofp.trade_names,
        other_intangible_asset_1: sofp.other_intangible_asset_1,
        other_intangible_asset_2: sofp.other_intangible_asset_2,
        account_payable: sofp.account_payable,
        salary_payable: sofp.salary_payable,
        interest_payable: sofp.interest_payable,
        taxes_payable: sofp.taxes_payable,
        warranty_payable: sofp.warranty_payable,
        rental_payable: sofp.rental_payable,
        notes_payable: sofp.notes_payable,
        bonds_payable: sofp.bonds_payable,
        other_current_liability_1: sofp.other_current_liability_1,
        other_current_liability_2: sofp.other_current_liability_2,
        other_non_current_liability_1: sofp.other_non_current_liability_1,
        other_non_current_liability_2: sofp.other_non_current_liability_2,
        share_capital: sofp.share_capital,
        less_withdrawal: sofp.less_withdrawal,
        retained_earning: sofp.retained_earning,
        other_equity_1: sofp.other_equity_1,
        other_equity_2: sofp.other_equity_2,
        end_date: sofp.end_date,
        remarks: sofp.remarks,
      })
      .then((res) => res.data);
  }

  static async getAllIncomeStatements() {
    const params = {
      order_by: "created_at_desc",
    };
    return axiosObject
      .get("/accounting/income_statement", { params })
      .then((res) => res.data);
  }

  static async getIncome(query, start_date, end_date, status) {
    const params = {};

    if (query?.name) params.name_like = query.name;
    if (start_date && end_date) {
      params.end_date_from = start_date.toISOString();
      params.end_date_to = end_date.toISOString();
    }
    if (status === true) {
      params.deleted_date_is_null = 1;
    } else if (status === false) {
      params.deleted_date_is_nn = 1;
    }
    params.order_by = "created_at_desc";

    return axiosObject
      .get("/accounting/income_statement", { params })
      .then((res) => res.data);
  }

  static async createIncome(income) {
    return axiosObject
      .post("/accounting/income_statement", {
        name: income.name, 
        start_date: income.start_date,
        end_date: income.end_date,
        remarks: income.remarks,
      })
      .then((res) => res.data);
  }

  static async getIncomeStatementById(id) {
    return axiosObject
      .get("/accounting/income_statement", { params: { id: id } })
      .then((res) => res.data);
  }

  static async deactivateIncomeStatement(id) {
    return axiosObject
      .post("/accounting/income_statement/deactivate", { id: id })
      .then((res) => res.data);
  }

  static async activateIncomeStatement(id) {
    return axiosObject
      .post("/accounting/income_statement/activate", { id: id })
      .then((res) => res.data);
  }

  static async updateIncomeStatement(income) {
    return axiosObject
      .put("/accounting/income_statement", {
        id: income.id,
        name: income.name,
        revenue: income.revenue,
        less_cost_of_goods_sold: income.less_cost_of_goods_sold,
        less_customer_sales_return: income.less_customer_sales_return,
        gain_on_sale_of_asset: income.gain_on_sale_of_asset,
        other_income_1: income.other_income_1,
        other_income_2: income.other_income_2,
        damaged_inventory: income.damaged_inventory,
        salary_expense: income.salary_expense,
        interest_expense: income.interest_expense,
        tax_expense: income.tax_expense,
        warranty_expense: income.warranty_expense,
        rental_expense: income.rental_expense,
        advertising_expense: income.advertising_expense,
        commissions_expense: income.commissions_expense,
        other_expense_1: income.other_expense_1,
        other_expense_2: income.other_expense_2,
        loss_on_sale_of_asset: income.loss_on_sale_of_asset,
        start_date: income.start_date,
        end_date: income.end_date,
        remarks: income.remarks,
      })
      .then((res) => res.data);
  }
}
