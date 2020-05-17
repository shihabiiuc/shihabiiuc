const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const markdown = require("marked")
const app = express()
const sanitizeHTML = require("sanitize-html")
const paypal = require("paypal-rest-sdk")
const dotenv = require("dotenv")
dotenv.config()

paypal.configure({
  mode: "live", //sandbox or live
  client_id: process.env.CLIENTID,
  client_secret: process.env.CLIENTSECRET
})

let sessionOptions = session({
  secret: "Shihab made this app",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
})
app.use(sessionOptions)
app.use(flash())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static("public"))
app.set("views", "views")
app.set("view engine", "ejs")

//locals An object that contains response local variables scoped to the request
app.use(function (req, res, next) {
  // Make our markdown available in ejs templates
  res.locals.filterUserHTML = function (content) {
    // return markdown(content) //disable links on posts
    return sanitizeHTML(markdown(content), { allowedTags: ["div", "code", "pre", "p", "br", "ul", "ol", "li", "strong", "bold", "i", "em", "h1", "h2", "h3", "h4", "h5", "h6"], allowedAttributes: {} })
  }

  // Make all flash message available on all templates
  res.locals.errors = req.flash("errors")
  res.locals.success = req.flash("success")

  // Make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id
  } else {
    req.visitorId = 0
  }

  // Make user session data available from within view templates
  res.locals.user = req.session.user
  next()
})

const router = require("./router")

app.use("/", router)

module.exports = app
