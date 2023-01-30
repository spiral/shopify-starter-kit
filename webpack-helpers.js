const path = require('path');
const fs = require('fs');

const getDirNames = (_path) =>
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

const makeEntryPointsBySource = (source, extList = [], filterCb = null) => {
  if (!fs.existsSync(source)) {
    return {};
  }

  return getFilesNames(source).reduce((res, name) => {
    const isRelatedFile = extList.includes(path.parse(name).ext);
    const isFilteredFile = filterCb ? filterCb(name) : true;

    if (!isRelatedFile || !isFilteredFile) {
      return res;
    }

    const entryKey = path.parse(name).name;
    const entryFile = path.resolve(__dirname, source, name);

    if (Array.isArray(res[entryKey])) {
      res[entryKey].push(entryFile);
    } else {
      res[entryKey] = [entryFile];
    }

    return res;
  }, {});
};

const makeJsEntryPoints = (source) => makeEntryPointsBySource(source, ['.js']);

const makeTemplatesEntryPoints = (templatesSource) => {
  if (!fs.existsSync(templatesSource)) {
    return {};
  }

  return getDirNames(templatesSource)
    .filter((name) => name !== 'common')
    .reduce((res, dirName) => {
      const templateEntries =
        makeEntryPointsBySource(
          path.resolve(templatesSource, dirName),
          ['.js', '.scss'],
          (name) => name.includes(dirName)
        ) || {};

      if (Object.keys(templateEntries).length) {
        Object.assign(res, templateEntries);
      }

      return res;
    }, {});
};

const makeTemplateCopyPluginPattern = (templatePath, nestedDestPath = '/') => ({
  from: `${templatePath}/*/*.{liquid,json}`,
  to: path.resolve(__dirname, `dist/templates${nestedDestPath}[name][ext]`),
  noErrorOnMissing: true,
});

const makeSnippetCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
  noErrorOnMissing: true,
});

const makeSectionCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`),
  noErrorOnMissing: true,
});

module.exports = {
  makeTemplatesEntryPoints,
  makeSnippetCopyPluginPattern,
  makeJsEntryPoints,
  makeTemplateCopyPluginPattern,
  makeSectionCopyPluginPattern,
  getDirNames,
};
