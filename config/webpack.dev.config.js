const path = require('path')
const webpack = require('webpack')
const WebpackMerge = require('webpack-merge')
const BaseConfig = require('./webpack.base.config')

module.exports = WebpackMerge(BaseConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname),
    hot: true,
    open: true,
    quiet: true,
    port: 8081,
    stats: { colors: true },
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})