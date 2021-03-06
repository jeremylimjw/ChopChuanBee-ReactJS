import moment from "moment";

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
   * Generic table component with no merged cells
   * @param {[]} tableHeaders Array of the names of the table's header 
   * @param {[[],...]} data  Array that contains each row of data for the table, 
   *                         the length of each row/sub array must be the same as tableHeader length
   * @param {[]} widths Array of the widths for the table, '*' wildcard is used for automatic sizing if undefined
   * @returns PDFMake table component
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
        margin: [0, 20, 0, 0]
      }
    }
    tableHeaders.map((val) => {
      return this.formatText(val)
    })
    tableComponent.table.body.push(tableHeaders)
    data.forEach((row) => {
      row.map((val) => {
        return this.formatText(val)
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

  static generateRemarkBox(text, style, width) {
    return {
      table: {
        heights: [15, 50],
        widths: width,
        body: [
          [{ text: 'SPECIAL INSTRUCTIONS OR REMARKS', style: { bold: true }, border: [] }],
          [this.formatText(text, style)]
        ]
      }
    }
  }

  static generateEmptyBox(width, height) {
    return {
      canvas: [{
        type: 'rect',
        x: 0,
        y: 0,
        w: width,
        h: height,
        r: 1,
        lineWidth: 1
      }]
    }
  }

  /**
   * 
   * @param {*} data 
   * Sample form data: 
   * key: {
   *  text: 'Display text',
   *  value: value 
   *  }
   * @param {*} textStyle Styling for the text
   * @param {*} width  Width between the form field name and displayed value
   * @param {*} colMargin 
   * @returns 
   */
  static generateForm(data, textStyle, width, colMargin) {
    let FORM_ITEM_WIDTH = width || '40%'
    let objArray = Object.entries(data) // [['id', {text: 'ADDRESS', val:'Blk 123'}], ...]
    let formData = []
    objArray.map((row) => {
      let [key, data] = [...row]
      if (colMargin) {
        formData.push({
          columns: [
            colMargin,
            { width: FORM_ITEM_WIDTH, text: this.formatText(data.text, textStyle) },
            { width: '*', text: this.formatText(data.value, textStyle) }
          ]
        })
      } else {
        formData.push({
          columns: [
            { width: FORM_ITEM_WIDTH, text: this.formatText(data.text, textStyle) },
            { width: '*', text: this.formatText(data.value, textStyle) }
          ]
        })
      }
    })
    return formData
  }
} 