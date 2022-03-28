export const generateCSV = (headers, data) => {
  // [[], [], []]
  let csvFile = ''
  headers.forEach((item) => csvFile.concat(',', item))
  console.log(csvFile)
  data.forEach((row) => {
    row.forEach((value) => {
      csvFile.concat(',', value)
    })
  })
  saveFile(csvFile)
}

const saveFile = () => {

}