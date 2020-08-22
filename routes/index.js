const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const multer = require('@koa/multer')
const render = require('koa-ejs')

const fs = require('fs')
const PDFExtract = require('pdf.js-extract').PDFExtract

const pdfExtract = new PDFExtract()

const storage = multer.diskStorage({
    //定义文件保存路径
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, './pdf/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })

router.post('/pdf', upload.single('file'), async (ctx, next) => {
    let { password } = ctx.request.body
    let options = null
    if (!!password) {
        options = { disableCombineTextItems: true, password: password }
    } else {
        options = { disableCombineTextItems: true }
    }
    try {
        let file = ctx.request.file
        // console.log(file)
        // console.log(ctx.request.file.path)
        let path = `./${file.path}`
        // console.log(buffer)
        let str = []
        let data = await pdfExtract.extract(path, options).then((data) => data)
        for (const pages of data.pages) {
            for (const content of pages.content) {
                str.push(content.str)
            }
        }
        return next().then(async () => {
            fs.unlink(`./pdf/${file.originalname}`, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('done')
                }
            })
            await ctx.render('index', {data: str})
            // console.log(str)
        })
    } catch (error) {
        ctx.response.body = {
            code: -1,
            msg: error.message,
        }
    }
})

router.get('/pdf', async (ctx, next) => {
  ctx.response.body = {
    code: 200,
    msg: 'test'
  }
})

module.exports = router
