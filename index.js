const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const ejs = require('ejs')

require('dotenv').config()

const routes = require('./routes')

const PORT = process.env.PORT || 5000

const app = express()

app.use((req, res, next) => {
  res.header('access-control-allow-origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')

  next()
})

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app
  .use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser())

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

// RegisterRoutes
routes.register(app)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
