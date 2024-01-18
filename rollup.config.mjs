// import multiEntry from '@rollup/plugin-multi-entry';
import sass from 'rollup-plugin-sass';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "rollup-plugin-commonjs";
import {
  makeJsInputs,
  makeTemplatesInputs
} from "./rollup-helpers.js";
import path from "path";


const postcssPluginsSet = makeTemplatesInputs('src/templates').scss.map((file) => {
  const extractName = `${path.parse(file).name}.css`;

  console.log('___', file, extractName)

  return postcss({
    include: file,
    extract: extractName,
    use: ['sass']
  });
})

export default {
  input: [
    ...makeTemplatesInputs('src/templates').js,
    ...makeJsInputs('src/scripts')
  ],
  output: {
    dir: 'dist/assets',
  },
  plugins: [
    // postcss({
    //   include: "src/templates/article/article.scss",
    //   extract: 'article.css',
    //   use: ['sass']
    // }),
    ...postcssPluginsSet,
    sass(),
    commonjs({
      include: "node_modules/**",
      namedExports: {
        // "./node_modules/react/index.js": [
        //   "cloneElement",
        //   "createElement",
        //   "PropTypes",
        //   "Children",
        //   "Component",
        //   "createFactory",
        //   "PureComponent",
        //   "lazy",
        //   "Suspense",
        //   "useState",
        //   "useEffect",
        // ],
        // "./node_modules/react-dom/index.js": ["findDOMNode"],
        // "./node_modules/babel-runtime/node_modules/core-js/library/modules/es6.object.to-string.js": [
        //   "default",
        // ],
        // "./node_modules/process/browser.js": ["nextTick"],
        // "./node_modules/events/events.js": ["EventEmitter"],
        // "./node_modules/react-is/index.js": ["isValidElementType"],
      },
    }),
    resolve()
  ],
};