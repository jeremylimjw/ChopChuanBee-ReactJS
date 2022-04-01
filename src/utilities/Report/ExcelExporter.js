export const generateCSV = (data, headers, fileName) => {
  // [[], [], []]
  let csvFile
  if (headers) {
    csvFile = headers.join(',') + '\r\n'
  }
  data.forEach((row) => {
    row.forEach((str) => {
      let newStr = str.replace(',', ' ')
      csvFile += newStr + ','
    })
    csvFile += '\r\n'
  })
  const encodedUri = encodeURI(csvFile)
  const link = document.createElement('a')
  link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + encodedUri)
  link.setAttribute("download", fileName || 'CSV Report')
  document.body.appendChild(link)
  link.click()
}
