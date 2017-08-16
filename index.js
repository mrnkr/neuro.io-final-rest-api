const express     = require('express')
const bodyParser  = require('body-parser')
const morgan      = require('morgan')
const mongoose    = require('mongoose')
const cors        = require('cors')

const app         = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())

mongoose.connect('mongodb://neuro:patata2@localhost:27017/neuroio')

app.use(cors())
app.use('/api', require('./routes/api'))

app.listen(3000, () => console.log('Listening on port 3000'))