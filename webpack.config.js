const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    library: 'AudioTrackMixer',
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader'
      }
    }]
  },
  plugins: [
    new webpack.BannerPlugin(`${package.description}\n \n@author ${package.author.name} <${package.author.url}>\n@license ${package.license}`),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(package.version)
    })
  ]
}
