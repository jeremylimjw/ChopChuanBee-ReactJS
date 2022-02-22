import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PDFTools {

  constructor(styles) {
    this.styles = styles
  }


  static formatText(text, style) {
    return { text, style }
  }

  static dividerLine(orientation, length) {
    switch (orientation.toLowerCase()) {
      case 'vertical':
        return {
          canvas: [{
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: length || 200,
            lineWidth: 1
          }]
        }
      case 'horizontal':
        return {
          canvas: [{
            type: 'line',
            x1: 0,
            y1: 0,
            x2: length || 200,
            y2: 0,
            lineWidth: 1
          }]
        }
      default:
        return
    }
  }

  /**
   * 
   * @param {[]} tableHeaders Array of the names of the table's header 
   * @param {[[],...]} data  Array that contains each row of data for the table, 
   *                         the length of each row/sub array must be the same as tableHeader length
   * @param {[]} widths Array of the widths for the table, '*' wildcard is used for automatic sizing if undefined
   * @returns 
   */
  static tableBuilder(tableHeaders, data, widths) {
    let tableWidth = widths || []
    if (!widths) {
      for (let i = 0; i < tableHeaders.length; i++) {
        tableWidth.push('*')  // equal spacing between each column
      }
    } else {
      tableWidth = widths
    }
    let tableComponent = {
      table: {
        widths: tableWidth,
        body: []
      },
      style: {
        margin: 10
      }
    }
    tableHeaders.map((val) => {
      return this.formatText(val)
    })
    tableComponent.table.body.push(tableHeaders)
    data.map((row) => {
      row.map((val) => {
        return this.formatText(val, { fontSize: '12' })
      })
      tableComponent.table.body.push(row)
    })
    return tableComponent
  }

  static generateHeader(data) {
    data = {
      title: 'PURCHASE ORDER',
      poNum: 'PO_123',
      poDate: moment(new Date())
    }
  }
  static generateBusinessInfo() {
    let FORM_WIDTH = '20%'
    let businessInfo = {
      addr: {
        columns: [
          { width: FORM_WIDTH, text: 'ADDRESS' },
          { width: '*', text: 'Blk 123 Singapore Street, Singapore 123456' }
        ]
      },
      contactNum: {
        columns: [
          { width: FORM_WIDTH, text: 'CONTACT NO.' },
          { width: '*', text: '+65 61234567 / 91234567 (Mobile)' }
        ]
      },
      bizRegNum: {
        columns: [
          { width: FORM_WIDTH, text: 'BUSINESS REG NO.' },
          { width: '*', text: '12345678BIZREG' }
        ]
      },
      gstRegNum: {
        columns: [
          { width: FORM_WIDTH, text: 'GST REG NO.' },
          { width: '*', text: '12345678GST' }
        ]
      }
    }
    return businessInfo
  }

  static generateForm(data) {
    let FORM_ITEM_WIDTH = '20%'
    let formattedDataArray = Object.entries(data) // [['id', '1'], ['name', 'john'], ...]
    let formObject = formattedDataArray.map((row) => {
      let [key, value] = [...row]
      formObject = {
        ...formObject,
        [key]: {
          columns: [
            { width: FORM_ITEM_WIDTH, text: key },
            { width: '*', text: value }
          ]
        }
      }
      return formObject
    })
    return formObject
  }
} 