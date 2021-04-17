const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');


module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin({
      patterns: [
        'theme',
        {
          from: `src/pages/*/*.liquid`,
          to: path.resolve(__dirname,`dist/templates/page.[name][ext]`)
        },
        {
          from: `src/pages/*/*/*.liquid`,
          to: path.resolve(__dirname, `dist/sections/[name][ext]`)
        },
        {
          from: `src/snippets/*/*.liquid`,
          to: path.resolve(__dirname, `dist/snippets/[name][ext]`)
        },
      ],
    }),
  ],
};
