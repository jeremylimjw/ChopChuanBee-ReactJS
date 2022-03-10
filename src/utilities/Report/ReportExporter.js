import { message } from "antd";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from './vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  NotoCh: {
    normal: 'NotoSansSC-Regular.otf',
    bold: 'NotoSansSC-Bold.otf',
    italics: 'NotoSans-Italic.ttf',
    bolditalics: 'NotoSans-BoldItalic.ttf',
  }
}

const generatePdf = async (doc) => {
  try {
    let pdf = pdfMake.createPdf(doc)
    pdf.open()
  } catch (err) {
    message.error('Error generating PDF report, please try again')
  }
}

export { generatePdf }
