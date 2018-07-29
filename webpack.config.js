var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              enforce: 'pre',
              include: [
                path.resolve(__dirname, 'src')
              ],
              loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};