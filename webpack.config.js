const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const RemoveFilesWebpackPlugin = require('remove-files-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SafePostCssParser = require('postcss-safe-parser');
const Autoprefixer = require('autoprefixer');
const {
  mkTemplateEntryPoints,
  mkSnippetCopyPluginPattern,
  mkJsEntryPoints,
  mkTemplateCopyPluginPattern,
  mkSectionCopyPluginPattern,
  getDirNames,
} = require('./webpack-helpers');

const TEXT_FILES_PATTERN = /\.(md|txt)$/m;
const IMAGE_FILES_PATTERN = /\.(jpg|jpeg|png|gif|svg)$/i;

const SRC_TEMPLATES_LIST = [
  ...getDirNames('src/templates').filter((dieName) => dieName !== 'common'),
  ...getDirNames('src/customers'),
];

const config = {
  mode: 'development',
  entry: {
    ...mkTemplateEntryPoints('src/templates'),
    ...mkTemplateEntryPoints('src/customers'),
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
        },
        mkTemplateCopyPluginPattern('src/templates'),
        mkTemplateCopyPluginPattern('src/customers', '/customers/'),
        mkSectionCopyPluginPattern('src/templates'),
        mkSnippetCopyPluginPattern('src/snippets'),
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
    new RemoveFilesWebpackPlugin({
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
      new ImageminWebpackPlugin({ test: IMAGE_FILES_PATTERN }),
    ];

    config.optimization.minimize = true;

    config.devtool = 'source-map';
  }

  return config;
};
