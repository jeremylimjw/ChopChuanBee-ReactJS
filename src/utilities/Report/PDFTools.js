import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PDFTools {

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
            y2: length || 300,
            lineWidth: 1
          }]
        }
      case 'horizontal':
        return {
          canvas: [{
            type: 'line',
            x1: 0,
            y1: 0,
            x2: length || 300,
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

  static generateForm(data, style) {
    let FORM_ITEM_WIDTH = style.formWidth || '40%'
    let objArray = Object.entries(data) // [['id', {text: 'ADDRESS', val:'Blk 123'}], ...]
    let formData = []
    objArray.map((row) => {
      let [key, data] = [...row]
      formData.push({
        columns: [
          { width: FORM_ITEM_WIDTH, text: this.formatText(data.text, style) },
          { width: '*', text: this.formatText(data.value, style) }
        ]
      })
    })
    return formData
  }
} 