const express = require('express')
const cors = require('cors')
const { __DEV__, APP_BUILD, HOST, PORT, APP_STATIC_PATH } = require('./constants')

const serverConfig = (app) => {
  app.use(cors())
  app.use(function(req, res, next) {    
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  app.get('/a', (req, res) => {
    res.json({ custom: 'response' })
  })
  app.use('/assets', express.static(APP_STATIC_PATH))
}

module.exports = {
  contentBase: APP_BUILD,
  compress: true,
  host: HOST,
  port: PORT,
  hot: __DEV__,
  headers: {
    'Access-Control-Allow-Origin': '*',    
  },
  disableHostCheck: true,
  historyApiFallback: true,
  open: true,
  overlay: true,
  setup: serverConfig,
  stats:  'minimal',
  watchContentBase: true,
  inline: true,
}
