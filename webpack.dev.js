const config = require('./webpack.config');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = Object.assign({}, config, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new WriteFilePlugin()
  ].concat(config.plugins)
});