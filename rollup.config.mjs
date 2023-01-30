import sass from 'rollup-plugin-sass';
import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import delete_ from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import { makeJsInputs, makeTemplatesInputs } from './rollup-helpers.js';
import path from 'path';

const postcssPluginsSet = makeTemplatesInputs('src/templates').scss.map(
  (file) => {
    const extractName = `${path.parse(file).name}.css`;

    return postcss({
      include: file,
      extract: extractName,
      use: ['sass'],
    });
  }
);


// TODO: install babel, imagemin, css minifier, js minifier, remove empty files
export default {
  input: [
    ...makeTemplatesInputs('src/templates').js,
    ...makeJsInputs('src/scripts'),
  ],
  output: {
    dir: 'dist/assets',
  },
  plugins: [
    copy({
      targets: [
        {src: `theme/*`, dest: `dist`},
        {src: 'src/layout', dest: `dist/layout`},
        {src: 'src/assets', dest: `dist/assets`},
        {src: 'src/templates/*/*.{liquid,json}', dest: `dist/templates`},
        {src: 'src/customers/*/*.liquid', dest: `dist/templates/customers`},
        {src: 'src/templates/*/*/*.liquid', dest: `dist/sections`},
        {src: 'src/snippets/*/*.liquid', dest: `dist/snippets`},
      ]
    }),
    ...postcssPluginsSet,
    sass(),
    commonjs({
      include: 'node_modules/**',
    }),
    resolve(),
    delete_({
      targets: 'dist/*'
    })
  ],
};
