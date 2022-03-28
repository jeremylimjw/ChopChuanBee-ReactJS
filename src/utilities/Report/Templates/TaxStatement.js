import moment from "moment"
import { PDFTools } from "../PDFTools"

const subHeaderData = (data) => {
  return {
    period: {
      text: 'Period',
      value: `${data.start_date} to ${data.end_date}`
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
      value: data.total_amount
    },
    totalIn: {
      text: 'Total Input Tax',
      value: data.total_tax
    }
  }
  let totalOutput = {
    totalTransactAmt: {
      text: 'Total Transaction Amount',
      value: data.total_amount
    },
    totalOut: {
      text: 'Total Output Tax',
      value: data.total_tax
    }
  }
  return { totalInput, totalOutput }
}

const styles = {
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

const constructTable = (data, headers) => {
  const widths = []
  let tableHeaders = headers.map((val) => PDFTools.formatText(val, 'tableHeader'))
  let taxTable = []
  data.map((transaction) => {
    let arr = []
    arr.push(PDFTools.formatText(transaction.order_id, 'tableContent'))
    arr.push(PDFTools.formatText(transaction.total_transaction_amount, 'tableContent'))
    arr.push(PDFTools.formatText(transaction.gst_rate, 'tableContent'))
    arr.push(PDFTools.formatText(transaction.gst_amount, 'tableContent'))
    arr.push(PDFTools.formatText(transaction.transaction_date, 'tableContent'))
    arr.push(PDFTools.formatText(transaction.company_name, 'tableContent'))
  })
}

const doc = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargins: [20, 10],
  defaultStyle: {
    font: 'NotoCh',
  },
  content: [],
  styles: styles
}

export const taxStatementTemplate = (data) => {
  let tableHeaders
  let content
  let totalData = formatTotalData(data)
  if (data.data[0].customer_id) {
    // Tax Input
    content = [
      PDFTools.formatText('Input Tax Transactions', 'header'),
    ]
    tableHeaders = ['Sales Order No.', 'Total Transaction Amt', 'GST Rate', 'GST Amt', 'Transaction Date',
      'Company', 'Customer ID', 'Customer Name']
    let taxInputTable = constructTable(data, tableHeaders)
    content.push(taxInputTable)
    content.push(PDFTools.generateForm(totalData.totalInput.totalTransactAmt, 'formText'))
    content.push(PDFTools.generateForm(totalData.totalInput.totalIn, 'formText'))
  } else {
    //Tax Output
    content = [
      PDFTools.formatText('Output Tax Transactions', 'header'),
    ]
    tableHeaders = ['Purchase Order No.', 'Total Transaction Amt', 'GST Rate', 'GST Amt', 'Transaction Date',
      'Company', 'Supplier ID', 'Supplier Name']
    let taxOutputTable = constructTable(data, tableHeaders)
    content.push(taxOutputTable)
    content.push(PDFTools.generateForm(totalData.totalOutput.totalTransactAmt, 'formText'))
    content.push(PDFTools.generateForm(totalData.totalOutput.totalOut, 'formText'))
  }
  doc.content = content
  return doc
}