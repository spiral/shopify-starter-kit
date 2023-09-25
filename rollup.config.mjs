import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import delete_ from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';
import { makeJsInputs, makeTemplatesInputs } from './rollup-helpers.js';

const postcssPluginsSet = makeTemplatesInputs('src/templates').scss.map(
  (file) => {
    const extractName = `${path.parse(file).name}.css`;

    return postcss({
      include: file,
      extract: extractName,
      use: ['sass'],
      sourceMap: true,
      minimize: true,
    });
  }
);

// TODO: imagemin, remove empty files
export default {
  input: [
    ...makeTemplatesInputs('src/templates').js,
    ...makeJsInputs('src/scripts'),
  ],
  output: {
    dir: 'dist/assets',
  },
  plugins: [
    delete_({
      targets: 'dist/*',
    }),
    copy({
      targets: [
        { src: `theme/*`, dest: `dist` },
        { src: 'src/layout', dest: `dist/layout` },
        { src: 'src/assets', dest: `dist/assets` },
        { src: 'src/templates/*/*.{liquid,json}', dest: `dist/templates` },
        { src: 'src/customers/*/*.liquid', dest: `dist/templates/customers` },
        { src: 'src/templates/*/*/*.liquid', dest: `dist/sections` },
        { src: 'src/snippets/*/*.liquid', dest: `dist/snippets` },
      ],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({ babelHelpers: 'bundled' }),
    resolve(),
    terser(),
    ...postcssPluginsSet,
    scss({ sourceMap: true, outputStyle: 'compressed' }),
  ],
};
