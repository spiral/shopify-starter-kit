const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminWebpackPlugin = require("imagemin-webpack-plugin").default;
const RemoveWebpackPlugin = require("remove-files-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  mkSectionsEntryPoints,
  mkTemplateEntryPoints,
  mkJsEntryPoints,
  mkTemplateCopyPlugin,
  mkSectionCopyPlugin,
} = require("./webpack-helpers.js");


const copySkipPatterns = [/\.css.liquid$/, /\.js\.liquid$/, /\.js\.map$/];

module.exports = {
  entry: {
    ...mkSectionsEntryPoints("src/pages"),
    ...mkTemplateEntryPoints("src/pages"),
    ...mkJsEntryPoints("src/assets"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].js",
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
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
          filter: (resourcePath) => {
            return !copySkipPatterns.reduce(
              (res, pattern) =>
                res || pattern.test(path.parse(resourcePath).base),
              false
            );
          },
        },
        {
          from: path.resolve(__dirname, `src/assets`),
          to: path.resolve(__dirname, `dist/assets`),
        },
        mkTemplateCopyPlugin("src/pages"),
        mkSectionCopyPlugin("src/pages"),
        {
          from: `src/snippets/*/*.liquid`,
          to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
        },
      ],
    }),
    new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].css",
    }),
    new RemoveWebpackPlugin({
      after: {
        test: [
          {
            folder: "dist",
            method: (absoluteItemPath) => {
              return new RegExp(/\.md$/, "m").test(absoluteItemPath);
            },
            recursive: true,
          },
        ],
      },
    }),
  ],
};
