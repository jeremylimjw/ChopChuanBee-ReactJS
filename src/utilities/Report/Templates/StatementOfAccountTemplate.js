import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatTemplateHeader = (data) => {
  return {
    statement_date: {
      text: 'STATEMENT DATE:',
      value: moment(data.date) || ''
    },
    statement_period: {
      text: 'STATEMENT PERIOD',
      value: `${moment(data.start_date)} - ${moment(data.end_date)}`
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
    }
  }
}

const formatCustomerData = (data) => {
  let customer = data.customer
  return {
    name: {
      text: 'NAME:',
      value: customer.name || ''
    },
    addr: {
      text: 'ADDRESS:',
      value: customer.address || ''
    },
    postalCode: {
      text: 'POSTAL CODE:',
      value: customer.postal_code || ''
    },
    contactName: {
      text: 'CONTACT PERSON:',
      value: customer.contactPerson || ''
    },
    contactNum: {
      text: 'CONTACT NUMBER:',
      value: customer.contact_number || ''
    },
  }
}

export const statementOfAccountTemplate = (data) => {
  let templateHeader = formatTemplateHeader(data)
  let companyData = formatCompanyData(data)
  let customerData = formatCustomerData(data)
  let document = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('STATEMENT OF ACCOUNT', 'header'),
      PDFTools.generateForm(templateHeader, { formWidth: '30%', margin: [200] }),
      PDFTools.dividerLine('horizontal', 515),
      {
        columns: [
          PDFTools.formatText('CHOP CHUAN BEE', 'subHeader'),
          PDFTools.formatText('CUSTOMER DETAILS', 'subHeader'),
        ]
      },
      {
        columns: [
          PDFTools.generateForm(companyData, { formWidth: '50%', fontSize: '11' }),
          PDFTools.generateForm(customerData, { formWidth: '50%', fontSize: '11' }),
        ]
      },
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      PDFTools.generateEmptyBox(515, 200),
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