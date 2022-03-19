import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from './vfs_fonts.js'
import { message } from "antd";
import { purchaseOrderTemplate } from "./Templates/PurchaseOrderTemplate.js";
import { salesInvoiceTemplate } from "./Templates/SalesInvoiceTemplate.js";
import { deliveryInstructionsTemplate } from "./Templates/DeliveryInstructionsTemplate"
import { statementOfAccountTemplate } from "./Templates/StatementOfAccountTemplate.js";
import { balanceSheetTemplate } from "./Templates/BalanceSheetTemplate.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  NotoCh: {
    normal: 'NotoSansSC-Regular.otf',
    bold: 'NotoSansSC-Bold.otf',
    italics: 'NotoSans-Italic.ttf',
    bolditalics: 'NotoSans-BoldItalic.ttf',
  }
}
const defaultDoc = {
  pageSize: 'A4',
  defaultStyle: {
    font: 'NotoCh'
  },
  content: []
}


const generatePdf = async (doc, templateName) => {
  try {
    switch (templateName) {
      case 'PO':
        doc = purchaseOrderTemplate(doc)
        break
      case 'SO':
        doc = salesInvoiceTemplate(doc)
        break
      case 'DELIVERY_ROUTES':
        doc = deliveryInstructionsTemplate(doc)
        break
      case 'SOA':
        doc = statementOfAccountTemplate(doc)
        break
      case 'BALANCE_SHEET':
        doc = balanceSheetTemplate(doc)
        break
      default:
        break
    }
    let pdf = pdfMake.createPdf(doc)
    pdf.open()
  } catch (err) {
    console.log(err)
    message.error('Error generating PDF report, please ensure details are filled up')
  }
}

export { generatePdf }
