//imort fs
const fs = require('fs')
//import extract method
const PDFExtract = require('pdf.js-extract').PDFExtract
//init method
const pdfExtract = new PDFExtract()


async function PDF_convert(path = '', password = null) {
  //abort when file is not pdf
  if (path.indexOf('.pdf') == -1) {
    return ''
  }

  let options = { disableCombineTextItems: true }
  let str = ``

  if (!!password) {
    Object.assign(options, { password: password })
  }

  let data = await pdfExtract
    .extract(path, options)
    .then((data) => {
      for (const pages of data.pages) {
        for (const content of pages.content) {
          str += `${content.str}\n`
        }
      }
      return data
    })
    .catch((err) => {
      if (err.name == 'PasswordException') {
        return 'Password error'
      }
    })

  console.log(28, { str, data, pw:options.password })
  return str
}

// PDF_convert(`C:\\Users\\Saki\\Downloads\\1.pdf`, '')
// PDF_convert(`C:\\Users\\Saki\\Downloads\\2.pdf`, '5316DN92')
// PDF_convert(`C:\\Users\\Saki\\Downloads\\2.pdf`, '')

PDF_convert(`E:\\Desktop\\2.pdf`, '5316DN92')
