import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatAssets = (data) => {
  let currentAssets = {
    cash_sales: {
      text: 'Cash (Sales)',
      value: data.cash_sales_of_goods
    },
    cash_others: {
      text: 'Cash (Others)',
      value: data.cash_others
    },
    ar: {
      text: 'Accounts Receivable',
      value: data.account_receivable
    },
    inv: {
      text: 'Inventory',
      value: data.inventory
    },
    supplies: {
      text: 'Supplies',
      value: data.supplies
    },
    prepaid_insurance: {
      text: 'Prepaid Insurance',
      value: data.prepaid_insurance
    },
    prepaid_rent: {
      text: 'Prepaid Rent',
      value: data.prepaid_rent
    },
    other_current_asset_1: {
      text: 'Other Current Asset (1)',
      value: data.other_current_asset_1
    },
    other_current_asset_2: {
      text: 'Other Current Asset (2)',
      value: data.other_current_asset_2
    }
  }
  let nonCurrentAssets = {
    land: {
      text: 'Land',
      value: data.land
    },
    land_depreciation: {
      text: 'Less: Accumulated Depreciation',
      value: data.less_accumulated_depreciation_land
    },
    building: {
      text: 'Building',
      value: data.building
    },
    building_depreciation: {
      text: 'Less: Accumulated Depreciation',
      value: data.less_accumulated_depreciation_building
    },
    equipments: {
      text: 'Equipments',
      value: data.equipments
    },
    equipment_depreciation: {
      text: 'Less: Accumulated Depreciation',
      value: data.less_accumulated_depreciation_equipments
    },
    other_non_ca_1: {
      text: 'Other Non-current Assets (1)',
      value: data.other_non_current_asset_1
    },
    other_non_ca_2: {
      text: 'Other Non-current Asset (2)',
      value: data.other_non_current_asset_2
    },

  }
  let intangibleAssets = {
    goodwill: {
      text: 'Goodwill',
      value: data.goodwill
    },
    trade_names: {
      text: 'Trade Names',
      value: data.trade_names
    },
    other_intangible_asset_1: {
      text: 'Other Intangible Asset (1)',
      value: data.other_intangible_asset_1
    },
    other_intangible_asset_2: {
      text: 'Other Intangible Asset (2)',
      value: data.other_intangible_asset_2
    },
  }
  let total = {
    totalAssets: {
      text: 'Total Assets',
      value: data.total_assets
    },
    total_current: {
      text: 'Total Current Assets',
      value: data.totalCurrentAssets
    },
    total_non_ca: {
      text: 'Total Non-current Assets',
      value: data.totalNonCurrentAssets
    },
    total_intangible_asset: {
      text: 'Total Intangible Assets',
      value: data.totalIntangibleAssets
    }
  }


  return { currentAssets, nonCurrentAssets, intangibleAssets, total }
}

const formatLiabilities = (data) => {
  let currentLiabilities = {
    ap: {
      text: 'Accounts Payable',
      value: data.account_payable
    },
    salary_payable: {
      text: 'Salary Payable',
      value: data.salary_payable
    },
    interest_payable: {
      text: 'Interest Payable',
      value: data.interest_payable
    },
    taxes_payable: {
      text: 'Taxes Payable',
      value: data.taxes_payable
    },
    warranty_payable: {
      text: 'Warranty Payable',
      value: data.warranty_payable
    },
    rental_payable: {
      text: 'Rental Payable',
      value: data.rental_payable
    },
    other_1: {
      text: 'Other Current Liability (1)',
      value: data.other_current_liability_1
    },
    other_2: {
      text: 'Other Current Liability (2)',
      value: data.other_current_liability_2
    },
  }
  let nonCurrentLiabilities = {
    notes_payable: {
      text: 'Notes Payable',
      value: data.notes_payable
    },
    bonds_payable: {
      text: 'Bonds Payable',
      value: data.bonds_payable
    },
    other_1: {
      text: 'Other Non-current Liability (1)',
      value: data.other_current_liability_1
    },
    other_2: {
      text: 'Other Non-current Liability (2)',
      value: data.other_current_liability_2
    },
  }
  let total = {
    total_current: {
      text: 'Total Current Liabilities',
      value: data.totalCurrentLiabilities
    },
    total_non_cl: {
      text: 'Total Non-current Liabilities',
      value: data.totalNonCurrentLiabilities
    },
    totalLiabilities: {
      text: 'Total Liabilities',
      value: data.totalLiabilities
    }
  }
  return { currentLiabilities, nonCurrentLiabilities, total }
}

const formatEquities = (data) => {
  let equities = {
    shareCapital: {
      text: 'Share Capital',
      value: data.share_capital
    },
    withdrawal: {
      text: 'Less: Withdrawal',
      value: data.less_withdrawal
    },
    retainedEarnings: {
      text: 'Retained Earnings',
      value: data.retained_earning
    },
    other_equity_1: {
      text: 'Other Equity (1)',
      value: data.other_equity_1
    },
    other_equity_2: {
      text: 'Other Equity (2)',
      value: data.other_equity_2
    }
  }
  let total = {
    totalEquities: {
      text: 'Total Equities',
      value: data.totalEquities
    }
  }
  return { equities, total }
}

export const balanceSheetTemplate = (data) => {
  let assetsData = formatAssets(data)
  let liabilitiesData = formatLiabilities(data)
  let equityData = formatEquities(data)
  let total_equity_and_liabilities = {
    text: 'Total Equity and Liabilities',
    value: data.totalLiabilitiesAndEquities
  }
  let document = {
    pageSize: 'A4',
    info: {
      title: `Balance Sheet as of ${moment(data.end_date).format('LL')}`
    },
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('CHOP CHUAN BEE', 'header'),
      PDFTools.formatText('Balance Sheet', 'header'),
      PDFTools.formatText(moment(data.end_date).format('LL'), 'subHeader'),
      // Assets 
      PDFTools.formatText('Assets', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('Current Assets', 'subHeader'),
          { width: '30%', ...PDFTools.formatText('$', 'subHeader') },
        ]
      },
      PDFTools.generateForm(assetsData.currentAssets, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([assetsData.total.total_current], 'formText', '70%'),
      PDFTools.formatText('Non-current Assets', 'subHeader'),
      PDFTools.generateForm(assetsData.nonCurrentAssets, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([assetsData.total.total_non_ca], 'formText', '70%'),
      PDFTools.formatText('Intangible Assets', 'subHeader'),
      PDFTools.generateForm(assetsData.intangibleAssets, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([assetsData.total.total_intangible_asset], 'formText', '70%'),
      PDFTools.generateForm([assetsData.total.totalAssets], 'boldFormText', '70%'),
      // Liabilities
      PDFTools.formatText('Liabilities', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('Current Liabilities', 'subHeader'),
          { width: '30%', ...PDFTools.formatText('$', 'subHeader') },
        ]
      },
      PDFTools.generateForm(liabilitiesData.currentLiabilities, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([liabilitiesData.total.total_current], 'formText', '70%'),
      PDFTools.formatText('Non-Current Liabilities', 'subHeader'),
      PDFTools.generateForm(liabilitiesData.nonCurrentLiabilities, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([liabilitiesData.total.total_non_cl], 'formText', '70%'),
      PDFTools.generateForm([liabilitiesData.total.totalLiabilities], 'boldFormText', '70%'),
      { text: '', pageBreak: 'after' },
      // Equities
      PDFTools.formatText('Equities', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('Equity', 'subHeader'),
          { width: '30%', ...PDFTools.formatText('$', 'subHeader') },
        ]
      },
      PDFTools.generateForm(equityData.equities, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([equityData.total.totalEquities], 'boldFormText', '70%'),
      PDFTools.generateForm([total_equity_and_liabilities], 'boldFormText', '70%'),
      { text: '', pageBreak: 'after' },
      PDFTools.formatText('Additional Comments or Remarks', 'subHeader'),
      PDFTools.generateEmptyBox(515, 200),

    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subHeader: {
        fontSize: 10,
        bold: true,
        alignment: 'left',
        margin: [0, 4]
      },
      formText: {
        fontSize: 9,
      },
      boldFormText: {
        fontSize: 9,
        bold: true
      },
      footerText: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }
    }
  }
  return document
}