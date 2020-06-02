const path = require('path');
const webpack = require('webpack');

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
    new webpack.BannerPlugin(`Mix audio tracks (MediaStreamTrack) into one.\n \n@author poplark <https://github.com/poplark>\n@license MIT`)
  ]
}
