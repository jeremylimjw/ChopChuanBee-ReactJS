import moment from "moment"
import { PDFTools } from "../PDFTools"


const formatRevenueData = (data) => {
  let netRevenueItems = {
    revenue: {
      text: 'Revenue',
      value: data.revenue
    },
    cogs: {
      text: 'Less: Cost of Goods Sold',
      value: data.less_cost_of_goods_sold
    },
    sales: {
      text: 'Less: Customer Sales',
      value: data.less_customer_sales_return
    },
  }
  let totalRevenueItems = {
    gain_on_asset_sale: {
      text: 'Gain on Sale of Asset',
      value: data.gain_on_sale_of_asset
    },
    other_income_1: {
      text: 'Other Income (1)',
      value: data.other_income_1
    },
    other_income_2: {
      text: 'Other Income (2)',
      value: data.other_income_2
    }
  }

  let total = {
    net_revenue: {
      text: 'Net Revenue',
      value: data.revenue
    },
    total_revenue: {
      text: 'Total Revenue',
      value: data.totalRevenue
    }
  }
  return { netRevenueItems, totalRevenueItems, total }
}

const formatExpensesData = (data) => {
  let expenses = {
    damaged_inventory: {
      text: 'Damaged Inventory',
      value: data.damaged_inventory
    },
    salary_expense: {
      text: 'Salary Expense',
      value: data.salary_expense
    },
    interest_expense: {
      text: 'Interest Expense',
      value: data.interest_expense
    },
    tax_expense: {
      text: 'Text Expense',
      value: data.tax_expense
    },
    warranty_expense: {
      text: 'Warranty Expense',
      value: data.warranty_expense
    },
    adv_expense: {
      text: 'Advertising Expense',
      value: data.advertising_expense
    },
    commissions_expense: {
      text: 'Commissions Expense',
      value: data.commissions_expense
    },
    loss_on_sale: {
      text: 'Loss on Sale of Asset',
      value: data.loss_on_sale_of_asset
    },
    other_expense_1: {
      text: 'Other Expense (1)',
      value: data.other_expense_1
    },
    other_expense_2: {
      text: 'Other Expense (2)',
      value: data.other_expense_2
    }
  }
  let total = {
    text: 'Total Expenses',
    value: data.totalExpenses
  }
  return { expenses, total }
}


export const profitLossStatement = (data) => {
  let revenueData = formatRevenueData(data)
  let expensesData = formatExpensesData(data)
  let endDate = moment(data.end_date).format('LL')
  let profit = {
    text: 'Net Profit',
    value: data.profit
  }
  let document = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'NotoCh'
    },
    info: {
      title: `Profit and Loss Statement for ${endDate}`
    },
    content: [
      PDFTools.formatText('CHOP CHUAN BEE', 'header'),
      PDFTools.formatText('Profit and Loss Statement', 'header'),
      PDFTools.formatText(endDate, 'subHeader'),
      // Revenue
      PDFTools.formatText('Revenue', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 2] },
      PDFTools.generateForm(revenueData.netRevenueItems, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([revenueData.total.net_revenue], 'boldFormText', '60%', { width: '10%', text: '' }),
      { text: '', margin: [0, 10] },
      PDFTools.generateForm(revenueData.totalRevenueItems, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([revenueData.total.total_revenue], 'boldFormText', '60%', { width: '10%', text: '' }),
      { text: '', margin: [0, 10] },
      PDFTools.formatText('Expenses', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 2] },
      PDFTools.generateForm(expensesData.expenses, 'formText', '60%', { width: '10%', text: '' }),
      PDFTools.generateForm([expensesData.total], 'boldFormText', '60%', { width: '10%', text: '' }),
      PDFTools.formatText('Profit', 'subHeader'),
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 2] },
      PDFTools.generateForm([profit], 'boldFormText', '60%', { width: '10%', text: '' }),
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
        fontSize: 11,
        bold: true,
        alignment: 'left',
        margin: [2, 4]
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