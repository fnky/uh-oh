const express = require('express')
const createErrorHandler = require('../')

const app = express()

app.get('/', (req, res, next) => {
  next(new Error('Oh, no! Bananas!'))
})

app.get('/async', (req, res, next) => {
  Promise.reject(new Error('O wow, many catch'))
    .catch(next)
})

app.use(createErrorHandler(app))

app.listen(3000)
