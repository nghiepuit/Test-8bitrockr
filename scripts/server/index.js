const express = require('express')
const compress = require('compression')
const path = require('path')
const cors = require('cors')
const app = express()

const publicPath = path.resolve(__dirname + '/../..', 'public')
app.use(cors())

app.use((req, res, next) => {
  let url = req.url
  console.log('----------------------')
  console.log('url 1: ', url)
  if (url.charAt(url.length - 1) === '/') {
    url = url.substring(0, url.length - 1)
    console.log('url 2: ', url)
  }
  req.url = url
  if (!url.endsWith('js') && !url.endsWith('png') && !url.endsWith('jpg') && !url.endsWith('jpeg')) {
    req.url = '/'
  }
  next()
})

app.use((req, res, next) => {
  next()
})

app.use(express.static(publicPath))

app.use(compress())
app.listen(3000, () => {
  console.log('running....')
})
