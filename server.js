const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const login = require('./routes/login')
const user = require('./routes/user')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan())

app.use('/api/login', login(express))
app.use('/api/user', user(express))

const port = process.env.PORT || 3000

app.listen(port, () => console.log('API live in the port ' + port))
