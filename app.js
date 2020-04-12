const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()
const router = require('./router')

let sessionOptions = session({
    secret: 'Shihab made this app',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
  })
app.use(sessionOptions)
app.use(flash())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app