import { PDFTools } from "../PDFTools"

const formatPOData = (data) => {
  return {
    po_num: {
      text: 'PO NO: ',
      value: data.po_num || '_____________________________________________'
    },
    po_date: {
      text: 'PO DATE: ',
      value: data.po_date || '_____________________________________________'
    }
  }
}

const formatCompanyData = (data) => {
  return {
    addr: {
      text: 'ADDRESS: ',
      value: data.addr || '_____________________________________________',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: data.contactNum || '_____________________________________________',
    },
    bizRegNum: {
      text: 'BUSINESS REG NO: ',
      value: data.bizRegNum || '_____________________________________________',
    },
    gstRegNum: {
      text: 'GST REG NO: ',
      value: data.gstRegNum || '_____________________________________________',
    }
  }
}

const formatVendorData = (data) => {
  return {
    vendorName: {
      text: 'VENDOR NAME: ',
      value: data.vendorName || '_____________________________________________',
    },
    contactPerson: {
      text: 'CONTACT PERSON: ',
      value: data.contactPerson || '_____________________________________________',
    },
    contactNum: {
      text: 'CONTACT NO: ',
      value: data.contactNum || '_____________________________________________',
    },
  }
}

export const purchaseOrderTemplate = (data) => {
  let poData = formatPOData(data.purchaseOrderData)
  let companyData = formatCompanyData(data.companyData)
  let vendorData = formatVendorData(data.vendorData)

  let document = {
    pageSize: 'A4',
    content: [
      PDFTools.formatText('PURCHASE ORDER', 'header'),
      PDFTools.generateForm(poData, { formWidth: '15%', margin: [200] }),
      PDFTools.dividerLine('horizontal', 500),
      PDFTools.formatText('CHOP CHUAN BEE', 'subHeader'),
      PDFTools.generateForm(companyData, { formWidth: '40%' }),
      PDFTools.formatText('VENDOR DETAILS', 'subHeader'),
      PDFTools.generateForm(vendorData, { formWidth: '40%' }),
      PDFTools.formatText('SHIP TO', 'subHeader'),
      PDFTools.generateForm({ addr: { ...companyData.addr } }, { formWidth: '40%' }),
      PDFTools.tableBuilder(data.purchaseOrderList.headers, data.purchaseOrderList.data, data.purchaseOrderList.widths)
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
        fontSize: 10
      }
    }
  }
  return document
}