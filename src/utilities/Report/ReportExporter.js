import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from './vfs_fonts.js'
import { message } from "antd";
import { purchaseOrderTemplate } from "./Templates/PurchaseOrderTemplate.js";
import { salesInvoiceTemplate } from "./Templates/SalesInvoiceTemplate.js";
import { deliveryInstructionsTemplate } from "./Templates/DeliveryInstructionsTemplate"
import { statementOfAccountTemplate } from "./Templates/StatementOfAccountTemplate.js";
import { balanceSheetTemplate } from "./Templates/BalanceSheetTemplate.js";
import { packingInstructionTemplate } from "./Templates/PackingInstructionTemplate.js";
import { deliverySticker } from "./Templates/DeliverySticker.js";
import { taxStatementTemplate } from "./Templates/TaxStatement.js";
import { profitLossStatement } from "./Templates/ProfitLossStatementTemplate.js";

pdfMake.vfs = pdfFonts;
pdfMake.fonts = {
  NotoCh: {
    normal: 'NotoSansSC-Regular.ttf',
    bold: 'NotoSans-Bold.ttf',
    italics: 'NotoSans-Italic.ttf',
    bolditalics: 'NotoSans-BoldItalic.ttf',
  }
}

const generatePdf = async (data, templateName, open = true) => {
  try {
    switch (templateName) {
      case 'PO':
        data = purchaseOrderTemplate(data)
        break
      case 'SO':
        data = salesInvoiceTemplate(data)
        break
      case 'SOA':
        data = statementOfAccountTemplate(data)
        break
      case 'BALANCE_SHEET':
        data = balanceSheetTemplate(data)
        break
      case 'PNL_STATEMENT':
        data = profitLossStatement(data)
        break
      case 'ITINERARY':
        data = deliveryInstructionsTemplate(data)
        break
      case 'PACKING_LIST':
        data = packingInstructionTemplate(data)
        break
      case 'STICKER':
        data = deliverySticker(data)
        break
      case 'TAX':
        data = taxStatementTemplate(data)
        break
      default:
        break
    }
    let pdf = pdfMake.createPdf(data)

    if (open === true) {
      pdf.open();
    }

    return pdf;
    
  } catch (err) {
    console.log(err)
    message.error('Error generating PDF report, please ensure details are filled up')
  }
}

export { generatePdf }
