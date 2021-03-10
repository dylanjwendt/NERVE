'use strict'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'web',
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
        test: /\.(otf|png)$/,
        loader: 'file-loader'
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
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: './assets/favicon' }
    //   ]
    // })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}
