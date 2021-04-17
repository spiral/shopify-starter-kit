const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const THEME_FOLDER = 'theme'
const DIST_FOLDER = 'dist'


module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: `${THEME_FOLDER}/assets`, to: path.resolve(__dirname, `${DIST_FOLDER}/assets`) },
        { from: `${THEME_FOLDER}/config`, to: path.resolve(__dirname, `${DIST_FOLDER}/config`) },
        { from: `${THEME_FOLDER}/layout`, to: path.resolve(__dirname, `${DIST_FOLDER}/layout`) },
        { from: `${THEME_FOLDER}/locales`, to: path.resolve(__dirname, `${DIST_FOLDER}/locales`) },
        { from: `${THEME_FOLDER}/sections`, to: path.resolve(__dirname, `${DIST_FOLDER}/sections`) },
        { from: `${THEME_FOLDER}/snippets`, to: path.resolve(__dirname, `${DIST_FOLDER}/snippets`) },
        { from: `${THEME_FOLDER}/templates`, to: path.resolve(__dirname, `${DIST_FOLDER}/templates`) },
      ],
    }),
  ],
};
