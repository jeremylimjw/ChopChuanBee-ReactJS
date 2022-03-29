import moment from "moment"
import { PDFTools } from "../PDFTools"

const subHeaderData = (data) => {
  return {
    period: {
      text: 'Period',
      value: `${data.dateRange[0]} to ${data.dateRange[1]}`
    },
    company: {
      text: 'Company',
      value: data.company
    }
  }
}

const formatTotalData = (data) => {
  let totalInput = {
    totalTransactAmt: {
      text: 'Total Transaction Amount',
      value: data.totalAmt
    },
    totalIn: {
      text: 'Total Input Tax',
      value: data.totalTax
    }
  }
  let totalOutput = {
    totalTransactAmt: {
      text: 'Total Transaction Amount',
      value: data.totalAmt
    },
    totalOut: {
      text: 'Total Output Tax',
      value: data.totalTax
    }
  }
  return { totalInput, totalOutput }
}

const constructTable = (data, headers) => {
  const widths = ['*', '*', '*', '*', '*', '*']
  let tableHeaders = headers.map((val) => PDFTools.formatText(val, 'tableHeader'))
  let taxTable = []
  if (data.length > 0) {
    taxTable = data.map((transaction) => {
      let arr = []
      arr.push(PDFTools.formatText(transaction.order_id, 'tableContent'))
      arr.push(PDFTools.formatText(transaction.total_transaction_amount, 'tableContent'))
      arr.push(PDFTools.formatText(transaction.gst_rate, 'tableContent'))
      arr.push(PDFTools.formatText(transaction.gst_amount, 'tableContent'))
      arr.push(PDFTools.formatText(transaction.transaction_date, 'tableContent'))
      arr.push(PDFTools.formatText(transaction.company_name, 'tableContent'))
      return arr
    })
  } else {
    taxTable = [['-', '-', '-', '-', '-', '-']]
  }
  let table = PDFTools.tableBuilder(tableHeaders, taxTable, widths)
  return table
}

export const taxStatementTemplate = (data) => {
  let doc
  if (data.taxType === 'input') {
    // Tax Input
    doc = inputTemplate(data)
  } else {
    //Tax Output
    doc = outputTemplate(data)
  }
  return doc
}

const inputTemplate = (data) => {
  let tableHeaders = ['Sales Order No.', 'Total Transaction Amt', 'GST Rate', 'GST Amt', 'Transaction Date',
    'Company']
  let taxInputTable = constructTable(data.items, tableHeaders)
  let totalData = formatTotalData(data)
  const doc = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      PDFTools.formatText('INPUT TAX TRANSACTIONS', 'header'),
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 5] },
      taxInputTable,
      PDFTools.generateForm(totalData.totalInput.totalTransactAmt, 'formText', '50%'),
      PDFTools.generateForm(totalData.totalInput.totalIn, 'formText', '50%')
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subHeader: {
        fontSize: 12,
        bold: true,
      },
      formText: {
        fontSize: 9
      },
      tableHeader: {
        fontSize: 10,
        alignment: 'center'
      },
      tableContent: {
        fontSize: 9,
      },
      footerText: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }
    }
  }
  return doc
}

const outputTemplate = (data) => {
  let tableHeaders = ['Purchase Order No.', 'Total Transaction Amt', 'GST Rate', 'GST Amt', 'Transaction Date',
    'Company']
  let taxOutputTable = constructTable(data.items, tableHeaders)
  let totalData = formatTotalData(data)
  const doc = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      PDFTools.formatText('Output Tax Transactions', 'header'),
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 5] },
      taxOutputTable,
      PDFTools.generateForm(totalData.totalOutput.totalTransactAmt, 'formText'),
      PDFTools.generateForm(totalData.totalOutput.totalOut, 'formText')
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subHeader: {
        fontSize: 12,
        bold: true,
      },
      formText: {
        fontSize: 9
      },
      tableHeader: {
        fontSize: 10,
        alignment: 'center'
      },
      tableContent: {
        fontSize: 9,
      },
      footerText: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }
    }
  }
  return doc

}