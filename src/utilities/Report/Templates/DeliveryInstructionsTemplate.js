import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatDelInstHeader = (data) => {
  return {
    instruction_sheet_no: {
      text: 'Instruction Sheet No.:',
      value: data.id || ''
    },
    instruction_sheet_date: {
      text: 'Date:',
      value: moment(data.created_at).format('ll') || ''
    }
  }
}

const formatDelInstData = (data) => {
  return {
    startPoint: {
      text: 'Starting Point:',
      value: data.startPoint || ''
    },
    estimatedStartTime: {
      text: 'Estimated Start Time:',
      value: data.start_time || ''
    },
    assignedDriver: {
      text: 'Assigned Driver:',
      value: data.employee.name || ''
    },
    session: {
      text: 'Session:',
      value: data.session || ''
    }
  }
}

const constructRoutesTable = (data) => {
  const widths = ['3%', '*', '*', '*', '*', '20%', '8%', '15%']
  const routesTableHeaders = ['ID', 'Company Name', 'Contact Name', 'Contact No.',
    'Sales Order No.', 'Address', 'Postal Code', 'Remarks']
    .map((val) => PDFTools.formatText(val, 'tableHeader'))
  let itinerary = []
  if (data.delivery_orders.length > 0) {
    data.delivery_orders.sort((a, b) => a.sequence - b.sequence)
    data.delivery_orders.map((order) => {
      let arr = []
      arr.push(PDFTools.formatText(order.sequence + 1, 'tableContent'))
      arr.push(PDFTools.formatText(order?.sales_order.customer.company_name, 'tableContent'))
      arr.push(PDFTools.formatText(order?.sales_order.customer.p1_name, 'tableContent'))
      arr.push(PDFTools.formatText(order?.sales_order.customer.p1_phone_number, 'tableContent'))
      arr.push(PDFTools.formatText(order?.sales_order.id, 'tableContent'))
      arr.push(PDFTools.formatText(order.address, 'tableContent'))
      arr.push(PDFTools.formatText(order.postal_code, 'tableContent'))
      arr.push(PDFTools.formatText(order.remarks, 'tableContent'))
      itinerary.push(arr)
    })
  } else {
    for (let i = 0; i < 8; i++) {
      itinerary.push('-')
    }
  }
  return PDFTools.tableBuilder(routesTableHeaders, itinerary, widths)
}

export const deliveryInstructionsTemplate = (data) => {
  let itineraryData = formatDelInstData(data)
  let routeTable = constructRoutesTable(data)
  let delHeader = formatDelInstHeader(data)
  const signatureLineLength = 150
  let document = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [20, 10],
    info: {
      title: `Delivery Itinerary on ${moment(data.created_at).format('ll')}`
    },
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      PDFTools.formatText('DELIVERY INSTRUCTION SHEET', 'header'),
      PDFTools.dividerLine('horizontal', 802),
      PDFTools.formatText('Details', 'subHeader'),
      {
        columns: [
          PDFTools.generateForm(itineraryData, 'formText', '30%'),
          PDFTools.generateForm(delHeader, 'formText', '30%'),
        ],
        margin: [0, 3]
      },
      routeTable,
      { text: '', margin: [0, 5] },
      // Special instruction box
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      { text: '', margin: [0, 0, 0, 2] },
      PDFTools.generateEmptyBox(802, 50),
      { text: '', margin: [0, 5] },
      // Signatures 
      {
        columns: [
          PDFTools.formatText('Completed Delivery Orders:', 'subHeader'),
          PDFTools.formatText('Completed Delivery Status Update on System:', 'subHeader')
        ]
      },
      { text: '', margin: [0, 15] },
      {
        columns: [
          PDFTools.dividerLine('horizontal', signatureLineLength),
          PDFTools.dividerLine('horizontal', signatureLineLength),
        ]
      },
      {
        columns: [
          PDFTools.formatText(`Driver's name and signature`, 'formText'),
          PDFTools.formatText(`Staff's name and signature`, 'formText')
        ]
      },
      { text: '', margin: [0, 15] },
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
      },
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