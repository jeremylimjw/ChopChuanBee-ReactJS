import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatPOData = (data) => {
  return {
    po_num: {
      text: 'PO NO: ',
      value: data.id || '_____________________________________________'
    },
    po_date: {
      text: 'PO DATE: ',
      value: moment(data.created_at).format('ll') || '_____________________________________________'
    }
  }
}

const formatCompanyData = (data) => {
  return {
    addr: {
      text: 'ADDRESS: ',
      value: data.addr || '',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: data.contactNum || '',
    },
    bizRegNum: {
      text: 'BUSINESS REG NO: ',
      value: data.bizRegNum || '',
    },
    shipping_addr: {
      text: 'SHIPPING ADDR',
    }
  }
}

const formatVendorData = (data) => {
  return {
    vendorName: {
      text: 'VENDOR NAME: ',
      value: data.supplier.company_name || '',
    },
    contactPerson: {
      text: 'CONTACT PERSON: ',
      value: data.s1_name || '',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: data.s1_phone_number || '',
    },
  }
}

export const purchaseOrderTemplate = (data) => {
  let poData = formatPOData(data)
  let companyData = formatCompanyData(data)
  let vendorData = formatVendorData(data)
  let POTableItems = data.purchase_order_items.map((item, index) => {
    let arr = []
    arr.push(index + 1)
    arr.push(item.product.name)
    arr.push(item.quantity)
    arr.push(item.product.unit)
    return arr
  })
  let POTableHeaders = ['No.', 'Item Name', 'Quantity', 'Unit']
  let document = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('PURCHASE ORDER', 'header'),
      PDFTools.generateForm(poData, { formWidth: '15%', margin: [200] }),
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
      PDFTools.tableBuilder(POTableHeaders, POTableItems, ['5%', '*', '20%', '20%']),
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