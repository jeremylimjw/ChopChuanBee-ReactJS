import moment from "moment"
import { PDFTools } from "../PDFTools"

const formatDelInstHeader = (data) => {
  return {
    instruction_sheet_no: {
      text: 'INSTRUCTION SHEET NO:',
      value: data.id || ''
    },
    instruction_sheet_date: {
      text: 'DATE:',
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
      text: 'Estimated Start Time',
      value: data.estimatedStartTime || ''
    },
    assignedDriver: {
      text: 'Assigned Driver',
      value: data.assignedDriver || ''
    },
    session: {
      text: 'Session',
      value: data.session || ''
    }
  }
}

export const deliveryInstructionsTemplate = (data) => {
  const routesTableHeaders = ['No', 'Company Name', 'Contact Person Name', 'Contact Person No.',
    'Customer Invoice No', 'Address', 'Postal Code', 'Boxes Qty', 'Remarks']
    .map((val) => PDFTools.formatText(val, { fontSize: '8' }))
  const routesTableWidths = ['2%', '*', '*', '*', '*', '*', '*', '*', '*']
  let delInstructions = formatDelInstData(data)
  let delHeader = formatDelInstHeader(data)
  let document = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [20, 10],
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      PDFTools.formatText('DELIVERY INSTRUCTION SHEET', 'header'),
      PDFTools.generateForm(delHeader, { formWidth: '30%', margin: [200] }),
      PDFTools.dividerLine('horizontal', 550),
      PDFTools.formatText('List of Delivery Routes', 'subheader'),
      PDFTools.tableBuilder(routesTableHeaders, [['1', '123 Fruit Stall', 'Daniel Koh', '91234567', '', '', '', '', '']], routesTableWidths),
      PDFTools.formatText('SPECIAL INSTRUCTIONS OR REMARKS', 'subHeader'),
      PDFTools.generateEmptyBox(550, 200)
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