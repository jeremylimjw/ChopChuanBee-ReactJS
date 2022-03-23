import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatSOData = (data) => {
  return {
    so_num: {
      text: 'Customer Invoice No.: ',
      value: data.id || '-'
    },
    so_date: {
      text: 'Customer Invoice Date: ',
      value: moment(data.created_at).format('ll') || '-'
    }
  }
}

const formatCompanyData = (data) => {
  let { name, address, contact_number, shipping_address, registration_number } = data.charged_under ? data.charged_under : {}
  let formattedData = {
    addr: {
      text: 'Address: ',
      value: address || '',
    },
    contactNum: {
      text: 'Contact No: ',
      value: contact_number || '',
    },
    shipping_addr: {
      text: 'Shipping Address:',
      value: shipping_address || ''
    }
  }
  if (name === 'Chuan Bee Food Stuff') {
    return formattedData
  } else {
    return {
      ...formattedData,
      bizRegNum: {
        text: 'Business Reg No.: ',
        value: registration_number || '',
      },
    }
  }
}

const formatVendorData = (data) => {
  return {
    vendorName: {
      text: 'Vendor Name: ',
      value: data.customer.company_name || '',
    },
    contactPerson: {
      text: 'Contact Person: ',
      value: data.customer.p1_name || '',
    },
    contactNum: {
      text: 'Contact No.: ',
      value: data.customer.p1_phone_number || '',
    },
  }
}

const constructSalesOrderTable = (data) => {
  let SOTableHeaders = ['No.', 'Item Name', 'Qty', 'Unit', 'Unit Price (S$)', 'Amount (S$)']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  let SOTableItems
  if (data.sales_order_items.length > 0) {
    SOTableItems = data.sales_order_items.map((item, index) => {
      let arr = []
      arr.push(PDFTools.formatText(index + 1, 'tableContent'))
      arr.push(PDFTools.formatText(item.product.name, 'tableContent'))
      arr.push(PDFTools.formatText(item.quantity, 'tableContent'))
      arr.push(PDFTools.formatText(item.product.unit, 'tableContent'))
      arr.push(PDFTools.formatText(item.unit_price, 'tableContent'))
      let sum = item.unit_price && item.quantity ? parseInt(item.unit_price) * parseInt(item.quantity) : '-'
      arr.push(PDFTools.formatText(`${sum}`, 'tableContent'))
      return arr
    })
  } else {
    SOTableItems = [['-', '-', '-', '-', '-', '-']]
  }
  SOTableItems.push(
    [{ ...PDFTools.formatText('Subtotal', { fontSize: '10', alignment: 'left' }), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText(data.preGstPrice, 'tableContent')],
    [{ ...PDFTools.formatText('GST Rate', { fontSize: '10', alignment: 'left' }), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText(`${data.gst_rate}%`, 'tableContent')],
    [{ ...PDFTools.formatText('Total', { fontSize: '10', alignment: 'left' }), colSpan: 5 }, {}, {}, {}, {}, PDFTools.formatText(data.totalPrice, 'tableContent')],
  )
  let widths = ['5%', '*', '8%', '8%', '15%', '15%']
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
    info: {
      title: `ID ${data.id} Customer Invoice for ${data.customer.company_name}`
    },
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('CUSTOMER INVOICE', 'header'),
      PDFTools.generateForm(soData, { formWidth: '30%', margin: [20] }),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('CHOP CHUAN BEE', 'subHeader'),
          PDFTools.formatText('VENDOR DETAILS', 'subHeader'),
        ]
      },
      {
        columns: [
          PDFTools.generateForm(companyData, 'formText', '50%'),
          PDFTools.generateForm(vendorData, 'formText', '50%'),
        ]
      },
      PDFTools.formatText('', 'header'),
      SOTable,
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      PDFTools.generateEmptyBox(515, 100),
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
        fontSize: 12,
        bold: true,
        margin: [0, 5]
      },
      formText: {
        fontSize: 8
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