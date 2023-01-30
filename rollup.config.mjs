import sass from 'rollup-plugin-sass';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
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

export default {
  input: [
    ...makeTemplatesInputs('src/templates').js,
    ...makeJsInputs('src/scripts'),
  ],
  output: {
    dir: 'dist/assets',
  },
  plugins: [
    ...postcssPluginsSet,
    sass(),
    commonjs({
      include: 'node_modules/**',
    }),
    resolve(),
  ],
};
