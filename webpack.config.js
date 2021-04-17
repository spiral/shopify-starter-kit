const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



const mkSectionsEntryPoints = () => {
  return {
    'page_initial_section': path.resolve(__dirname, 'src/pages/page_initial/page_initial_section/page_initial_section.js'),
    'common_section': path.resolve(__dirname, 'src/pages/common/common_section/common_section.js'),

  }
}

const mkPagesEntryPoints = () => {
  return {
    'page_initial': path.resolve(__dirname, 'src/pages/page_initial/page_initial.js'),
  }
}

const config = {

}
module.exports = {
  entry: {
    ...mkPagesEntryPoints(),
    ...mkSectionsEntryPoints()
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "assets/[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin({
      patterns: [
        // 'theme',
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
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css'
    }),
  ],
};
