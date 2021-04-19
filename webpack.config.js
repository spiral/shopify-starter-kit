const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs')


const getFolders = (path) => fs.readdirSync(path, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map((dirent) => dirent.name)


const mkSectionsEntryPoints = (templatePath) => {
  const resultEntries = {}

  getFolders(templatePath)
    .forEach((folderName) => {
      getFolders(`${templatePath}/${folderName}`)
        .forEach((subFolder) => {
          const fileName = subFolder // The file must have the same name as its component
          const filePath = path.resolve(__dirname, templatePath, `${folderName}/${subFolder}/${fileName}.js`)

          if (fs.existsSync(filePath)) {
            resultEntries[fileName] = filePath
          }
        })
    })

  return resultEntries
}


const mkTemplateEntryPoints = (templatePath) =>
  getFolders(templatePath)
    .filter(name => name !== 'common')
    .reduce((res, name) => ({
      ...res,
      [name]: path.resolve(__dirname, templatePath, `${name}/${name}.js`)
    }), {})


const mkTemplateCopy = (templatePath) => {
  const templatePrefix = templatePath.replace('src/', '').replace('/', '-')

  return {
    from: `${templatePath}/*/*.liquid`,
    to: path.resolve(__dirname,`dist/templates/${templatePrefix}.[name][ext]`)
  }
}


const mkSectionCopy = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`)
})


module.exports = {
  entry: {
    ...mkSectionsEntryPoints('src/pages'),
    ...mkTemplateEntryPoints('src/pages'),
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
        mkTemplateCopy('src/pages'),
        mkSectionCopy('src/pages'),
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
