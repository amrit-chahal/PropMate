const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { copyFile } = require('fs');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const _ = require('lodash');
const commonConfig = {
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/contentScript/contentScript.tsx')
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/i
      },
      {
        type: 'asset/resource',
        test: /\.(jpeg|jpg|png|woff|woff2|ttf|svg)$/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new Dotenv({
      path: './.env'
    }),

    ...getHtmlPlugins(['popup', 'options'])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript';
      }
    }
  }
};
const firefoxConfig = {
  name: 'firefox',

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist-firefox')
        },
        {
          from: path.resolve('src/firefox'),
          to: path.resolve('dist-firefox')
        }
      ]
    })
  ],

  output: {
    filename: '[name].js',
    path: path.resolve('dist-firefox')
  }
};
const chromeConfig = {
  name: 'chrome',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist-chrome')
        },
        {
          from: path.resolve('src/chrome'),
          to: path.resolve('dist-chrome')
        }
      ]
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('dist-chrome')
  }
};

module.exports = [
  _.merge({}, commonConfig, firefoxConfig),
  _.merge({}, commonConfig, chromeConfig)
];

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'PropMate',
        filename: `${chunk}.html`,
        chunks: [chunk]
      })
  );
}
