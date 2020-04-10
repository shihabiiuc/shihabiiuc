const express = require('express')
const app = express()
const router = require('./router')

app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

let port = process.env.PORT
if(port == null || port == "") {
    port = 3000
}
app.listen(port)