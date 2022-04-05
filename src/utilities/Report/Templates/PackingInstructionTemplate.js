import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatPackerSubHeader = (data) => {
  return {
    custInvoiceNo: {
      text: 'Sales Invoice Number',
      value: data.id
    },
    invoiceDate: {
      text: 'Invoice Date',
      value: moment(data.created_at).format('LL')
    }
  }
}

const constructItemTable = (data) => {
  const tableHeaders = ['No.', 'Item Name', 'Qty', 'Unit', 'Completed?', 'Box Label']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  let tableItems = data.sales_order_items.map((item, index) => {
    let arr = []
    arr.push(PDFTools.formatText(index + 1, 'tableContent'))
    arr.push(PDFTools.formatText(item.product.name, 'tableContent'))
    arr.push(PDFTools.formatText(item.quantity, 'tableContent'))
    arr.push(PDFTools.formatText(item.product.unit, 'tableContent'))
    arr.push(' ')
    arr.push(' ')
    return arr
  })
  let widths = ['5%', '*', '10%', '10%', '15%', '12%']
  let itemTable = PDFTools.tableBuilder(tableHeaders, tableItems, widths)
  return itemTable
}

export const packingInstructionTemplate = (data) => {
  const packerData = formatPackerSubHeader(data)
  const customerDetails = {
    text: 'Customer Details',
    value: data.customer.company_name
  }
  const itemTable = constructItemTable(data)
  const signatureLineLength = 150
  let document = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    info: {
      title: `Packer Instruction Sheet`
    },
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      PDFTools.formatText('PACKER INSTRUCTION SHEET', 'header'),
      PDFTools.generateForm(packerData, 'formText', '30%'),
      { text: '', margin: [0, 5] },
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 5] },
      PDFTools.formatText('Customer Details', 'subHeader'),
      PDFTools.generateForm([customerDetails], 'formText', '50%'),
      { text: '', margin: [0, 5] },
      itemTable,
      // Signature
      { text: '', margin: [0, 20] },
      {
        columns: [
          PDFTools.dividerLine('horizontal', signatureLineLength),
          PDFTools.dividerLine('horizontal', signatureLineLength),
        ]
      },
      {
        columns: [
          PDFTools.formatText(`Packer's name and signature`, 'formText'),
          PDFTools.formatText(`Staff's name and signature`, 'formText')
        ]
      },
      { text: '', margin: [0, 20] },
      {
        columns: [
          PDFTools.dividerLine('horizontal', signatureLineLength),
          PDFTools.dividerLine('horizontal', signatureLineLength),
        ]
      },
      {
        columns: [
          PDFTools.formatText(`Date:`, 'formText'),
          PDFTools.formatText(`Date:`, 'formText')
        ]
      }
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
  return document
}