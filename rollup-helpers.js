import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

export const getDirNames = (_path) =>
  !fs.existsSync(_path)
    ? []
    : fs
        .readdirSync(_path, { withFileTypes: true })
        .filter(Boolean)
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

const getFilesNames = (_path) =>
  !fs.existsSync(_path)
    ? []
    : fs
        .readdirSync(_path, { withFileTypes: true })
        .filter(Boolean)
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);

export const makeInputsBySource = (source, extList = [], filterCb = null) => {
  if (!fs.existsSync(source)) {
    return {};
  }

  return getFilesNames(source)
    .filter((name) => {
      const isRelatedFile = extList.includes(path.parse(name).ext);
      const isFilteredFile = filterCb ? filterCb(name) : true;

      return isRelatedFile && isFilteredFile;
    })
    .map((name) => path.resolve(__dirname, source, name));
};

export const makeJsInputs = (source) => makeInputsBySource(source, ['.js']);

export const makeTemplatesInputs = (templatesSource) => {
  if (!fs.existsSync(templatesSource)) {
    return {};
  }

  return getDirNames(templatesSource)
    .filter((name) => name !== 'common')
    .reduce(
      (res, dirName) => {
        (
          makeInputsBySource(
            path.resolve(templatesSource, dirName),
            ['.js', '.scss'],
            (name) => name.includes(dirName)
          ) || []
        ).forEach((file) => {
          if (file.includes('.js')) {
            res.js.push(file);
          }

          if (file.includes('.scss')) {
            res.scss.push(file);
          }
        });

        return res;
      },
      { js: [], scss: [] }
    );
};
