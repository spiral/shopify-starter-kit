const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'theme',
        {
          from: `src/pages/*/*.liquid`,
          to: path.resolve(__dirname,`dist/templates/page.[name][ext]`)
        },
        {
          from: `src/pages/common/**/*.liquid`,
          to: path.resolve(__dirname, `dist/snippets/[name][ext]`)
        },
      ],
    }),
  ],
};
