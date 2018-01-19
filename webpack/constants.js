const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolvePath = (relativePath) => path.resolve(appDirectory, relativePath)

const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = {
  __DEV__,
  __PROD__: process.env.NODE_ENV === 'production',
  PUBLIC_PATH: '/',
  PUBLIC_ASSETS_PATH: '/assets',
  SRC_PATH: resolvePath('./src'),
  NODE_MODULE_PATH: resolvePath('./node_modules'),
  APP_INDEX: resolvePath('./src/index'),
  APP_BUILD: resolvePath('./public'),
  APP_HTML: resolvePath('./statics/index.html'),
  APP_STATIC_PATH: resolvePath('./statics'),
  PACKAGE_PATH: resolvePath('./package.json'),
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  BUNDLE_NAME: '[name]__[hash].chunk.js',
  CHUNK_NAME: '[name]__[hash].chunk.js',
  GLOBAL_STYLE_PATH: resolvePath('./src/commons/scss'),
  IMAGE_BUNDLE_NAME: 'static/images/[name].[hash:8].[ext]',
  CSS_MODULE_NAME: __DEV__
    ? '[name]__[local]___[hash:base64:5]'
    : '[name]__[hash:base64:8]',
  VENDOR_PACKAGES: [
    'react',
    'react-dom',
    'redux',
    'redux-observable',
    'react-redux',
    'react-router-dom',
    'history/createBrowserHistory',
    'transition-group',
    'fetch-everywhere',
    'babel-polyfill',
    'redux-devtools-extension/logOnlyInProduction',
    'bootstrap',
    'jquery',
  ],
  MANIFEST_FILE: 'asset-manifest.json',
  SCSS_DATA: `
    @import "_color.scss";
    @import "_variables.scss";
    @import "_style.scss";
  `,
  BACKEND_PORT: process.env.BACKEND_PORT,
  BACKEND_HOST: process.env.BACKEND_HOST,
  BACKEND_PROTOCOL: process.env.BACKEND_PROTOCOL,
}
