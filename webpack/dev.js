const {
  __DEV__,
  SCSS_DATA,
  PACKAGE_PATH,
  VENDOR_PACKAGES,
  SRC_PATH,
  CHUNK_NAME,
  CSS_MODULE_NAME,
  PUBLIC_PATH,
  APP_INDEX,
  BUNDLE_NAME,
  APP_BUILD,
  GLOBAL_STYLE_PATH,
  APP_HTML,
  PUBLIC_ASSETS_PATH,
  BACKEND_PORT,
  BACKEND_HOST,
  BACKEND_PROTOCOL,
} = require('./constants')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devServer = require('./dev.server')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const path = require('path')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const pathsToClean = [
  'dist',
  'build',
]

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',

  /** ========================================
   * INPUT ENTRY
   * ======================================== */

  entry: {
    main: [
      'react-error-overlay',
      'babel-polyfill',
      'react-dev-utils/webpackHotDevClient',
      'react-hot-loader/patch',
      APP_INDEX,
    ],
    vendor: VENDOR_PACKAGES,
  },

  /* ========================================
   * OUTPUT
   * ======================================== */

  output: {
    filename: BUNDLE_NAME,
    chunkFilename: CHUNK_NAME,
    path: APP_BUILD,
    publicPath: PUBLIC_PATH,
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath),
  },

  /* ========================================
   * LOADERS
   * ======================================== */

  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: SRC_PATH,
        enforce: 'pre',
        use: [{
          loader: 'eslint-loader',
          options: {
            // Pass the formatter:
            formatter: eslintFormatter,
          },
        }],
      },
      {
        use: [
          'style-loader',
          'css-loader',
        ],
        test: /\.css$/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            camelCase: true,
            localIdentName: CSS_MODULE_NAME,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')(),
              require('cssnano')(),
            ],
            sourceMap: Boolean(__DEV__),
          },
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [GLOBAL_STYLE_PATH],
            sourceMap: Boolean(__DEV__),
            data: SCSS_DATA,
          },
        },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        }],
      },
      {
        loader: 'file-loader',
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$|\.ico$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.scss', '.css'],
    modules: ['src', 'packages', 'node_modules'],
  },

  /* ========================================
   * PLUGIN
   * ======================================== */
  plugins: [
    new CleanWebpackPlugin(pathsToClean),

    new InterpolateHtmlPlugin({ PUBLIC_URL: PUBLIC_ASSETS_PATH }),

    new HtmlWebpackPlugin({ title: 'my-project', chunksSortMode: 'dependency', template: APP_HTML, inject: true }),

    new ExtractCssChunks(),

    // new webpack
    //   .optimize
    //   .ModuleConcatenationPlugin(),
    // new CaseSensitivePathsPlugin(),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack
      .optimize
      .CommonsChunkPlugin({ names: ['vendor'], filename: CHUNK_NAME, minChunks: Infinity }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new WatchMissingNodeModulesPlugin(PACKAGE_PATH),
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        __DEV__,
        __PROD__: !__DEV__,
        BACKEND_PORT: JSON.stringify(BACKEND_PORT),
        BACKEND_HOST: JSON.stringify(BACKEND_HOST),
        BACKEND_PROTOCOL: JSON.stringify(BACKEND_PROTOCOL),
        NODE_ENV: JSON.stringify('development'),
      },
    }),

    new AutoDllPlugin({
      context: SRC_PATH,
      filename: BUNDLE_NAME,
      entry: {
        vendor: VENDOR_PACKAGES,
      },
    }),

    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),

  ],

  /* ========================================
   * DEV SERVER
   * ======================================== */
  devServer,
}

console.log(JSON.stringify(devServer))
