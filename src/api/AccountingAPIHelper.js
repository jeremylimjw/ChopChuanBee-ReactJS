import { axiosObject } from "./axiosWrapper";

export class AccountingAPIHelper {

    static async getAllSOFPs() {
        const params = {
          order_by: 'created_at_desc'
        };
        return axiosObject.get("/accounting/SOFP", { params })
          .then((res) => res.data);
    }

    static async getSOFPById(id) {
        return axiosObject.get("/accounting/SOFP", { params: { id: id } })
          .then((res) => res.data);
    }

    static async getSOFP(query, start_date, end_date) {
        const params = {};
        
        if (query?.name)
          params.name_like = query.name;
        if (start_date && end_date){
          params.end_date_from = start_date.toISOString();
          params.end_date_to = end_date.toISOString();
        }
        // if (query?.deleted === true) {
        //   params.deleted_date_is_null = 1;
        // } else if (query?.deleted === false) {
        //   params.deleted_date_is_nn = 1;
        // }
        params.order_by = 'created_at_desc';
        
       return axiosObject.get("/accounting/SOFP", { params })
          .then((res) => res.data);
    }
    
    static async createSOFP(SOFP) {
        return axiosObject
          .post("/accounting/SOFP", {
            name: SOFP.name,
            end_date: SOFP.end_date,
          })
          .then((res) => res.data)
    }

    static async deactivateSOFP(id) {
      return axiosObject.post("/accounting/SOFP/deactivate", { id: id })
        .then((res) => res.data);
    }

    static async activateSOFP(id) {
      return axiosObject.post("/accounting/SOFP/activate", { id: id })
        .then((res) => res.data);
    }

    static async updateSOFP(sofp) {
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
          less_accumulated_depreciation_land: sofp.less_accumulated_depreciation_land, 
          building: sofp.building, 
          less_accumulated_depreciation_building: sofp.less_accumulated_depreciation_building, 
          equipments: sofp.equipments, 
          less_accumulated_depreciation_equipments: sofp.less_accumulated_depreciation_equipments, 
          other_non_current_asset_1: sofp.other_non_current_asset_1, 
          other_non_current_asset_2: sofp.other_non_current_asset_2, 
          goodwill: sofp.goodwill, 
          trade_names: sofp.trade_names, 
          other_intangible_asset_1: sofp.other_intangible_asset_1, 
          other_intangible_asset_2: sofp.other_intangible_asset_2, 
          salary_payable: sofp.salary_payable, 
          interest_payable: sofp.interest_payable, 
          taxes_payable: sofp.taxes_payable, 
          warranty_payable: sofp.warranty_payable, 
          rental_payable: sofp.rental_payable, 
          notes_payable: sofp.notes_payable, 
          bonds_payable: sofp.bonds_payable, 
          other_liability_1: sofp.other_liability_1, 
          other_liability_2: sofp.other_liability_2, 
          share_capital: sofp.share_capital, 
          less_withdrawal: sofp.less_withdrawal, 
          retained_earning: sofp.retained_earning, 
          other_equity_1: sofp.other_equity_1, 
          other_equity_2: sofp.other_equity_2,
          end_date: sofp.end_date
        })
        .then((res) => res.data)
    }
}