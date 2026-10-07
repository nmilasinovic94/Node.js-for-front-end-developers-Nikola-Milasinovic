const path = require('path')
const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'public')))
// fCC posts form data; JSON is supported too
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
