import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatPOData = (data) => {
  return {
    po_num: {
      text: 'Purchase Order No: ',
      value: data.id || ''
    },
    po_date: {
      text: 'Purchase Order Date: ',
      value: moment(data.created_at).format('ll') || ''
    }
  }
}

const formatCompanyData = (data) => {
  let { address, contact_number, shipping_address, registration_number } = data.charged_under ? data.charged_under : {}

  return {
    addr: {
      text: 'Address: ',
      value: address || '',
    },
    contactNum: {
      text: 'Contact No: ',
      value: contact_number || '',
    },
    bizRegNum: {
      text: 'Business Reg No: ',
      value: registration_number || '',
    },
    shipping_addr: {
      text: 'Shipping Address:',
      value: shipping_address
    }
  }
}

const formatVendorData = (data) => {
  let vendorData = data.supplier
  return {
    vendorName: {
      text: 'Vendor Name: ',
      value: vendorData.company_name || '',
    },
    contactPerson: {
      text: 'Contact Person: ',
      value: vendorData.s1_name || '',
    },
    contactNum: {
      text: 'Contact No: ',
      value: vendorData.s1_phone_number || '',
    },
  }
}

const constructPurchaseOrderTable = (data) => {
  let POTableHeaders = ['No.', 'Item Name', 'Qty', 'Unit']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  let POTableItems
  if (data.purchase_order_items.length > 0) {
    POTableItems = data.purchase_order_items.map((item, index) => {
      let arr = []
      arr.push(PDFTools.formatText(index + 1, 'tableContent'))
      arr.push(PDFTools.formatText(item.product.name, 'tableContent'))
      arr.push(PDFTools.formatText(item.quantity, 'tableContent'))
      arr.push(PDFTools.formatText(item.product.unit, 'tableContent'))
      return arr
    })
  } else {
    POTableItems = [['-', '-', '-', '-']]
  }
  let widths = ['5%', '*', '15%', '15%']
  let POTable = PDFTools.tableBuilder(POTableHeaders, POTableItems, widths)
  return POTable
}

export const purchaseOrderTemplate = (data) => {
  let poData = formatPOData(data)
  let companyData = formatCompanyData(data)
  let vendorData = formatVendorData(data)
  let POTable = constructPurchaseOrderTable(data)
  let document = {
    pageSize: 'A4',
    info: {
      title: `ID ${data.id} Purchase Order for ${data.supplier.company_name}`
    },
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('PURCHASE ORDER', 'header'),
      PDFTools.generateForm(poData, { formWidth: '30%', margin: [20] }),
      { text: '', margin: [0, 5] },
      PDFTools.dividerLine('horizontal', 515),
      { text: '', margin: [0, 5] },
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
      POTable,
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
        fontSize: 14,
        bold: true,
        margin: [0, 5]
      },
      formText: {
        fontSize: 9
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