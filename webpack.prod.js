const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const configs = [];
common.forEach((config) =>
  configs.push(
    merge(config, {
      mode: 'production'
    })
  )
);
module.exports = configs;
