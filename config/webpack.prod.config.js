const path = require('path')
const WebpackMerge = require('webpack-merge')
const BaseConfig = require('./webpack.base.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge(BaseConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([
      'dist'
    ]),
    new UglifyJSWebpackPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        }
      }
    })
  ]
})