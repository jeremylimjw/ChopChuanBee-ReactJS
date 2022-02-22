import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const A4_REPORT_SIZE = {
  length: 842,
  width: 595
}

// const fonts = {
//   Roboto: {
//     normal: 'fonts/Roboto-Regular.ttf',
//     bold: 'fonts/Roboto-Medium.ttf',
//     italics: 'fonts/Roboto-Italic.ttf',
//     bolditalics: 'fonts/Roboto-MediumItalic.ttf'
//   }
// }

const generatePdf = async (doc) => {
  try {
    pdfMake.createPdf(doc).open()
  } catch (err) {
    console.log(err)
  }
}

export { generatePdf }
