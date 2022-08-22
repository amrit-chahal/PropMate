const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const configs = [];
common.forEach((config) =>
  configs.push(
    merge(config, {
      mode: 'development',
      devtool: 'cheap-module-source-map'
    })
  )
);
module.exports = configs;
