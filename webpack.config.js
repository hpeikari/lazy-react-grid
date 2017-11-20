'use-strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const htmlPlugin = new HtmlWebpackPlugin({
  template: 'index.html'
});

const styleLoader = sourceMaps => ({
  test: /\.(scss|css)$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        query: {
          sourceMap: sourceMaps,
          minimize: true,
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      }, {
        loader: 'postcss-loader',
        query: {
          sourceMap: sourceMaps,
          plugins: (loader) => [
              require('autoprefixer')
            ]
        }
      }, {
        loader: 'sass-loader',
        query: { sourceMap: sourceMaps }
      }
    ]
  })
});

const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
};

const svgLoader = {
  test: /\.svg$/,
  exclude: /node_modules/,
  loader: 'svg-react-loader'
};

const fileLoader = {
  test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
  exclude: /src/,
  loader: 'url-loader?limit=100000'
};


module.exports = {
  entry: './index.js',
  output: {
    path: '/',
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    port: 3000
  },
  plugins: [
    htmlPlugin,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('bundle.css')
  ],
  module: {
    loaders: [
      babelLoader,
      svgLoader,
      fileLoader,
      styleLoader(true)
    ]
  }
}
