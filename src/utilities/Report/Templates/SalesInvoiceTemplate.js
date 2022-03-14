import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatSOData = (data) => {
  return {
    so_num: {
      text: 'SALES ORDER NO: ',
      value: data.id || '_____________________________________________'
    },
    so_date: {
      text: 'SALES ORDER DATE: ',
      value: moment(data.created_at).format('ll') || '_____________________________________________'
    }
  }
}

const formatCompanyData = (data) => {
  let companyData = data.charged_under
  return {
    addr: {
      text: 'ADDRESS: ',
      value: companyData.address || '',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: companyData.contact_number || '',
    },
    bizRegNum: {
      text: 'BUSINESS REG NO: ',
      value: companyData.registration_number || '',
    },
    shipping_addr: {
      text: 'SHIPPING ADDRESS:',
      value: companyData.shipping_address
    }
  }
}

const formatVendorData = (data) => {
  let vendorData = data.customer
  return {
    vendorName: {
      text: 'VENDOR NAME: ',
      value: vendorData.company_name || '',
    },
    contactPerson: {
      text: 'CONTACT PERSON: ',
      value: vendorData.p1_name || '',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: vendorData.p1_phone_number || '',
    },
  }
}

const constructSalesOrderTable = (data) => {
  let SOTableHeaders = ['No.', 'Item Name', 'Qty', 'Unit', 'Unit Price', 'Amount']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  let SOTableItems = data.sales_order_items.map((item, index) => {
    let arr = []
    arr.push(PDFTools.formatText(index + 1, 'tableContent'))
    arr.push(PDFTools.formatText(item.product.name, 'tableContent'))
    arr.push(PDFTools.formatText(item.quantity, 'tableContent'))
    arr.push(PDFTools.formatText(item.product.unit, 'tableContent'))
    arr.push(PDFTools.formatText(item.unit_price, 'tableContent'))
    let sum = parseInt(item.unit_price) * parseInt(item.quantity)
    arr.push(PDFTools.formatText(`${sum}`, 'tableContent'))
    return arr
  })
  SOTableItems.push(
    [{ ...PDFTools.formatText('Subtotal', 'tableHeader'), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText('50000', 'tableContent')],
    [{ ...PDFTools.formatText('GST Rate', 'tableHeader'), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText(data.charged_under.gst_rate, 'tableContent')],
    [{ ...PDFTools.formatText('Total', 'tableHeader'), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText('50000', 'tableContent')],
  )
  let widths = ['5%', '*', '10%', '10%', '10%', '10%']
  let SOTable = PDFTools.tableBuilder(SOTableHeaders, SOTableItems, widths)
  return SOTable
}

export const salesInvoiceTemplate = (data) => {
  let soData = formatSOData(data)
  let companyData = formatCompanyData(data)
  let vendorData = formatVendorData(data)
  let SOTable = constructSalesOrderTable(data)
  let document = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('SALES ORDER', 'header'),
      PDFTools.generateForm(soData, { formWidth: '30%', margin: [200] }),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('CHOP CHUAN BEE', 'subHeader'),
          PDFTools.formatText('VENDOR DETAILS', 'subHeader'),
        ]
      },
      {
        columns: [
          PDFTools.generateForm(companyData, { formWidth: '50%', fontSize: '10' }),
          PDFTools.generateForm(vendorData, { formWidth: '50%', fontSize: '10' }),
        ]
      },
      PDFTools.formatText('', 'header'),
      SOTable,
      // PDFTools.tableBuilder(SOTableHeaders, SOTableItems, ['5%', '*', '10%', '10%', '10%', '10%']),
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      PDFTools.generateEmptyBox(515, 200),
      PDFTools.formatText(`If you have any questions about this purchase order, please contact ${companyData.contactNum.value}`, 'footerText')
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 5]
      },
      formText: {
        fontSize: 10
      },
      footerText: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      },
      tableContent: {
        fontSize: 9,
        alignment: 'center'
      },
      tableHeader: {
        fontSize: 10,
        alignment: 'center'
      }
    }
  }
  return document
}