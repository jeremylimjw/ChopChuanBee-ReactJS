import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatTemplateHeader = (data) => {
  data.sora.sort()
  return {
    statement_date: {
      text: 'Statement Creation Date: ',
      value: moment().format('LL') || ''
    },
    statement_period: {
      text: 'Statement Period: ',
      value: `${moment(data.start).format('MMMM')} - ${moment(data.end).format('MMMM')}`
    }
  }
}

const formatCompanyData = (data) => {
  let company = data.company
  return {
    addr: {
      text: 'Address: ',
      value: company.address || '',
    },
    contactNum: {
      text: 'Contact No: ',
      value: company.contact_number || '',
    },
    bizRegNum: {
      text: 'Business Reg No: ',
      value: company.registration_number || '',
    }
  }
}

const formatCustomerData = (data) => {
  let customer = data.customer
  return {
    name: {
      text: 'Name:',
      value: customer.company_name || ''
    },
    addr: {
      text: 'Address:',
      value: customer.address || ''
    },
    postalCode: {
      text: 'Postal Code:',
      value: customer.postal_code || ''
    },
    contactName: {
      text: 'Contact Person:',
      value: customer.p1_name || ''
    },
    contactNum: {
      text: 'Contact No:',
      value: customer.p1_phone_number || ''
    },
  }
}

const constructTable = (data) => {
  let formattedData = []
  const widths = ['5%', '20%', '*', '18%', '18%', '18%']
  let tableHeaders = ['No.', 'Date', 'Order ID', 'Charges ($)', 'Paid ($)', 'Balance ($)']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  if (data.length > 0) {
    formattedData = data.map((item, index) => {
      let arr = []
      arr.push(PDFTools.formatText(index + 1, 'tableContent'))
      arr.push(PDFTools.formatText(moment(item.created_at).format('LL'), 'tableContent'))
      arr.push(PDFTools.formatText(item.so_id, 'tableContent'))
      arr.push(PDFTools.formatText(item.charges, 'tableContent'))
      arr.push(PDFTools.formatText(item.amount_paid, 'tableContent'))
      arr.push(PDFTools.formatText(item.balance, 'tableContent'))
      return arr
    })
  } else {
    formattedData = [['\n', '\n', '\n', '\n', '\n', '\n']]
  }
  let soaTable = PDFTools.tableBuilder(tableHeaders, formattedData, widths)
  return soaTable
}

export const statementOfAccountTemplate = (data) => {
  console.log(data)
  let templateHeader = formatTemplateHeader(data)
  let companyData = formatCompanyData(data)
  let customerData = formatCustomerData(data)
  let soaTable = constructTable(data.sora)
  let document = {
    pageSize: 'A4',
    info: {
      title: `State of Account Receivables for ${data.customer.company_name}`
    },
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('STATEMENT OF ACCOUNT', 'header'),
      PDFTools.generateForm(templateHeader, 'formText', '30%'),
      { text: '', margin: [0, 0, 0, 5] },
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('CHOP CHUAN BEE', 'subHeader'),
          PDFTools.formatText('CUSTOMER DETAILS', 'subHeader'),
        ]
      },
      {
        columns: [
          PDFTools.generateForm(companyData, 'formText', '50%'),
          PDFTools.generateForm(customerData, 'formText', '50%'),
        ]
      },
      { text: '', margin: [0, 8] },
      soaTable,
      PDFTools.formatText(`If you have any questions about this statement, please contact ${data.company.contact_number}`, 'footerText')

    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      subHeader: {
        fontSize: 12,
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
      tableHeader: {
        fontSize: 10,
        alignment: 'center'
      },
      tableContent: {
        fontSize: 9,
        alignment: 'center'
      }
    }
  }
  return document
}