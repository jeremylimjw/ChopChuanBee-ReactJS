import { PDFTools } from "../PDFTools"

export const balanceSheetTemplate = (data) => {

  let document = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'NotoCh'
    },
    content: [
      PDFTools.formatText('Balance Sheet', 'header'),
      PDFTools.dividerLine('horizontal', 515),
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