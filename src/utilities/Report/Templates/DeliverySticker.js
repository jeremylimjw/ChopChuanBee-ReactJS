const constructSticker = (data) => {
  // data = require('./itinerary.json')
  // data = data.delivery_orders[1]
  console.log(data)
  let sticker = {
    body: [
      [{ text: 'CHOP CHUAN BEE', style: 'header', colSpan: 2, alignment: 'center' }, ''],
      [{ text: 'TO', style: 'subHeader' }, { text: 'ADDRESS', style: 'subHeader' }],
      [{ text: `${data.customer.company_name}`, style: 'tableContent' }, { text: `${data.delivery_address} Singapore ${data.delivery_postal_code}`, style: 'tableContent', rowSpan: 3 }],
      [{ text: `${data.customer.p1_name}`, style: 'tableContent' }, ''],
      [{ text: `${data.customer.p1_phone_number}`, style: 'tableContent' }, ''],
      //[{ image: data.qr_code, height: 100, width: 100, colSpan: 2, alignment: 'center', border: [true, true, true, false] }, ''],
      [{ text: `Sales Order ID: ${data.id}`, style: 'tableContent', colSpan: 2, alignment: 'center', border: [true, false, true, true] }, ''],
      [{ text: 'Remarks', style: 'tableHeader', colSpan: 2 }, ''],
      [{ text: `${data.delivery_remarks}`, style: 'tableContent', colSpan: 2, rowSpan: 3 }, ''],
      ['', ''],
      ['', '']
    ]
  }
  return sticker
}

export const deliverySticker = (data) => {
  let document = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [20, 10],
    defaultStyle: {
      font: 'NotoCh',
    },
    content: [
      {
        columns: [
          { table: constructSticker(data) },
          { width: '5%', text: '' },
          { table: constructSticker(data) }
        ]
      },
      { text: '', margin: [0, 2] },
      {
        columns: [
          { table: constructSticker(data) },
          { width: '5%', text: '' },
          { table: constructSticker(data) }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subHeader: {
        fontSize: 12,
        bold: true,
      },
      formText: {
        fontSize: 9
      },
      tableHeader: {
        fontSize: 12,
      },
      tableContent: {
        fontSize: 10,
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
