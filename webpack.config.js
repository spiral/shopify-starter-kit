const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs')


const getFolders = (path) => fs.readdirSync(path, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map((dirent) => dirent.name)


const mkSnippetsEntryPoints = () => {
  getFolders('src/pages')
    .filter(name => name !== 'common')
    .reduce((res, name) => ({
      ...res,
      [name]: path.resolve(__dirname, 'src/pages', `${name}/${name}.js`)
    }), {})
}

const mkSectionsEntryPoints = () => {
  const resultEntries = {}

  getFolders('src/pages')
    .forEach((folderName) => {
      getFolders(`src/pages/${folderName}`)
        .forEach((subFolder) => {
          const fileName = subFolder // The file must have the same name as its component
          const filePath = path.resolve(__dirname, 'src/pages', `${folderName}/${subFolder}/${fileName}.js`)

          if (fs.existsSync(filePath)) {
            resultEntries[fileName] = filePath
          }
        })
    })

  return resultEntries
}


const mkPagesEntryPoints = () =>
  getFolders('src/pages')
    .filter(name => name !== 'common')
    .reduce((res, name) => ({
      ...res,
      [name]: path.resolve(__dirname, 'src/pages', `${name}/${name}.js`)
    }), {})


module.exports = {
  entry: {
    ...mkSnippetsEntryPoints(),
    ...mkSectionsEntryPoints(),
    ...mkPagesEntryPoints(),
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
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css'
    }),
  ],
};
