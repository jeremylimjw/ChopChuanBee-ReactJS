import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatSOData = (data) => {
  return {
    po_num: {
      text: 'SALES ORDER NO: ',
      value: data.id || '_____________________________________________'
    },
    po_date: {
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

export const salesInvoiceTemplate = (data) => {
  let soData = formatSOData(data)
  let companyData = formatCompanyData(data)
  let vendorData = formatVendorData(data)
  let SOTableItems = data.sales_order_items.map((item, index) => {
    let arr = []
    arr.push(index + 1)
    arr.push(item.product.name)
    arr.push(item.quantity)
    arr.push(item.product.unit)
    return arr
  })
  let SOTableHeaders = ['No.', 'Item Name', 'Quantity', 'Unit']
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
          PDFTools.generateForm(companyData, { formWidth: '50%', fontSize: '11' }),
          PDFTools.generateForm(vendorData, { formWidth: '50%', fontSize: '11' }),
        ]
      },
      PDFTools.formatText('', 'header'),
      PDFTools.tableBuilder(SOTableHeaders, SOTableItems, ['5%', '*', '20%', '20%']),
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      PDFTools.generateEmptyBox(515, 200),
      PDFTools.formatText('If you have any questions about this purchase order, please contact 61234567', 'footerText')
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
      }
    }
  }
  return document
}