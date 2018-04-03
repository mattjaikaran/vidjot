const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express()

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport config
require('./config/passport')(passport)

// DB Config
const db = require('./config/database')

mongoose.connect(db.mongoURI)
.then(() => {console.log('MongoDB Connected')})
.catch(err => {console.log(err)})

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Method override middleware
app.use(methodOverride('_method'))

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash middleware
app.use(flash())

//Global Flash Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', { title })
})

app.get('/about', (req, res) => {
  res.render('about')
})

// Use routes. Links to express router
app.use('/ideas', ideas)
app.use('/users', users)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
