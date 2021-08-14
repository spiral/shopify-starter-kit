const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const RemoveWebpackPlugin = require('remove-files-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  mkTemplateEntryPoints,
  mkSnippetCopyPlugin,
  mkJsEntryPoints,
  mkTemplateCopyPlugin,
  mkSectionCopyPlugin,
} = require('./webpack-helpers');

const jsFilesPatterns = [/\.js$/, /\.js\.map$/];

const config = {
  entry: {
    ...mkTemplateEntryPoints('src/pages'),
    ...mkJsEntryPoints('src/assets'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
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
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, `src/layout`),
          to: path.resolve(__dirname, `dist/layout`),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, `src/assets`),
          to: path.resolve(__dirname, `dist/assets`),
          noErrorOnMissing: true,
          filter: (resourcePath) => {
            const fileBase = String(path.parse(resourcePath).base);

            return !jsFilesPatterns.some((pattern) => fileBase.match(pattern));
          },
        },
        mkTemplateCopyPlugin('src/pages'),
        mkTemplateCopyPlugin('src/customers'),
        mkSectionCopyPlugin('src/pages'),
        mkSnippetCopyPlugin('src/snippets'),
      ],
    }),
    new MiniCssExtractPlugin({
      filename: ({ chunk: { name } }) =>
        name.includes('theme')
          ? `assets/${name}.css`
          : `snippets/${name}.css.liquid`,
    }),
    new RemoveWebpackPlugin({
      after: {
        test: [
          {
            folder: 'dist',
            method: (absoluteItemPath) => /\.md$/m.test(absoluteItemPath),
            recursive: true,
          },
        ],
      },
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.plugins.push(
      new ImageminWebpackPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
    );

    config.optimization.minimize = true;
    config.devtool = 'source-map';
  }

  return config;
};
