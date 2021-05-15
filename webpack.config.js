const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const RemoveWebpackPlugin = require('remove-files-webpack-plugin');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  mkSectionsEntryPoints,
  mkTemplateEntryPoints,
  mkJsEntryPoints,
  mkTemplateCopyPlugin,
  mkSectionCopyPlugin,
} = require("./webpack-helpers.js");


module.exports = {
  entry: {
    ...mkSectionsEntryPoints("src/pages"),
    ...mkTemplateEntryPoints("src/pages"),
    ...mkJsEntryPoints("src/assets"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].js",
    clean: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `theme`),
          to: path.resolve(__dirname, `dist`),
        },
        mkTemplateCopyPlugin("src/pages"),
        mkSectionCopyPlugin("src/pages"),
        {
          from: `src/snippets/*/*.liquid`,
          to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
        },
        {
          from: `src/layout/*.liquid`,
          to: path.resolve(__dirname, `dist/layout/[name][ext]`),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].css",
    }),
    new RemoveWebpackPlugin({
      after: {
        test: [
          {
            folder: 'dist',
            method: (absoluteItemPath) => {
              return new RegExp(/\.md$/, 'm').test(absoluteItemPath);
            },
            recursive: true
          }
        ]
      }
    })
  ],
};
