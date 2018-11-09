const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: [
    './src/main.js',
    './src/style/main.sass'
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  externals: {
    'vue': 'Vue' 
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader:  'webpack-replace-loader',
            options: {
              arr: [
                { search: '@', replace: 'mode', attr: 'g'}
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/images',
        to: 'images',
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true
      }
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'Vue',
          entry: `https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue${process.env.NODE_ENV == 'production' ? '.min' : ''}.js`
        }
      ]
    })
  ]
}