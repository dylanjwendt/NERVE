'use strict'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const cwd = process.cwd().endsWith('Client') ? __dirname : path.resolve(__dirname, 'Client')

console.log(`Running webpack in folder ${cwd}`)

module.exports = {
  target: 'web',
  context: cwd,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin({
    //   verbose: true,
    //   cleanOnceBeforeBuildPatterns: [
    //     '**/*',
    //     '!android-chrome-*.png',
    //     '!apple-touch-icon.png',
    //     '!browserconfig.xml',
    //     '!favicon*',
    //     '!mstile-*.png',
    //     '!safari-pinned-tab.svg',
    //     '!site.webmanifest'
    //   ],
    //   cleanAfterEveryBuildPatterns: [
    //     '!android-chrome-*.png',
    //     '!apple-touch-icon.png',
    //     '!browserconfig.xml',
    //     '!favicon*',
    //     '!mstile-*.png',
    //     '!safari-pinned-tab.svg',
    //     '!site.webmanifest'
    //   ]
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './res', to: './res' }
      ]
    }),
    new NodePolyfillPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}
