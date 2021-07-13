const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { copyFile } = require('fs');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/contentScript/contentScript.ts')
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'csss-loader'],
        test: /\.css$/i
      },
      {
        type: 'asset/resource',
        test: /\.(jpeg|jpg|png|woff|woff2|ttf|svg)$/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist')
        }
      ]
    }),
    new HtmlPlugin({
      title: 'PropMate',
      filename: 'popup.html',
      chunks: ['popup']
    })
  ],
  resolve: {
    extensions: ['.tsx', 'ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  }
};
