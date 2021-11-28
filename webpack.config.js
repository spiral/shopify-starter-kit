const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const RemoveFilesPlugin = require('remove-files-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const webpack = require('webpack');

const SafePostCssParser = require('postcss-safe-parser');
const Autoprefixer = require('autoprefixer');
const {
  makeTemplateEntryPoints,
  makeSnippetCopyPluginPattern,
  mkJsEntryPoints,
  makeTemplateCopyPluginPattern,
  makeSectionCopyPluginPattern,
  getDirNames,
} = require('./webpack-helpers');

const TEXT_FILES_PATTERN = /\.(md|txt)$/m;
const IMAGE_FILES_PATTERN = /\.(jpg|jpeg|png|gif|svg)$/i;

const SRC_TEMPLATES_LIST = [
  ...getDirNames('src/templates').filter((dieName) => dieName !== 'common'),
  ...getDirNames('src/customers'),
];

const config = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    ...makeTemplateEntryPoints('src/templates'),
    ...makeTemplateEntryPoints('src/customers'),
    ...mkJsEntryPoints('src/scripts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].js',
  },
  optimization: {
    noEmitOnErrors: true,
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: SafePostCssParser,
          map: {
            // `inline: false` forces the sourcemap to be output into a
            // separate file
            inline: false,
            // `annotation: true` appends the sourceMappingURL to the end of
            // the css file, helping the browser find the sourcemap
            annotation: true,
          },
        },
      }),
    ],
  },
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
        test: IMAGE_FILES_PATTERN,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new RemoveEmptyScriptsPlugin(),
    new CopyPlugin({
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
        },
        makeTemplateCopyPluginPattern('src/templates'),
        makeTemplateCopyPluginPattern('src/customers', '/customers/'),
        makeSectionCopyPluginPattern('src/templates'),
        makeSnippetCopyPluginPattern('src/snippets'),
      ],
    }),
    new MiniCssExtractPlugin({
      // Creating style snippet for each template and
      // using snippet as inline styles.
      // Implements a scoped styles.
      filename: ({ chunk: { name } }) =>
        SRC_TEMPLATES_LIST.includes(name)
          ? `snippets/${name}.css.liquid`
          : `assets/${name}.css`,
    }),
    new RemoveFilesPlugin({
      before: {
        include: ['./dist'],
      },
      after: {
        test: [
          {
            folder: 'dist',
            method: (absoluteItemPath) =>
              TEXT_FILES_PATTERN.test(absoluteItemPath),
            recursive: true,
          },
        ],
      },
    }),
    Autoprefixer,
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.plugins = [
      ...config.plugins,
      new ImageminPlugin({ test: IMAGE_FILES_PATTERN }),
    ];
  }

  return config;
};
