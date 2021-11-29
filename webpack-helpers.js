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

const makeEntryPointsFactory = (templatePath, _extList = [], filterCb = null) =>
  getFilesNames(templatePath).reduce((res, name) => {
    const isRelatedFile = _extList.includes(path.parse(name).ext);
    const isFilteredFile = filterCb ? filterCb(name) : true;

    if (!isRelatedFile || !isFilteredFile) {
      return res;
    }

    const entryKey = path.parse(name).name;
    const entryFile = path.resolve(__dirname, templatePath, name);
    const entryValues = [...(res[entryKey] || []), entryFile];

    return {
      ...res,
      [`${entryKey}`]: entryValues,
    };
  }, {});

const makeJsEntryPoints = (sourcePath) =>
  makeEntryPointsFactory(sourcePath, ['.js']);

const makeTemplateEntryPoints = (sourcePath, filterCb) =>
  makeEntryPointsFactory(sourcePath, ['.js', '.scss'], filterCb);

const makeTemplatesEntryPoints = (templatePath) =>
  getDirNames(templatePath)
    .filter((name) => name !== 'common')
    .reduce((res, dirName) => {
      const templateEntries =
        makeTemplateEntryPoints(path.resolve(templatePath, dirName), (name) =>
          name.includes(dirName)
        ) || {};

      return {
        ...res,
        ...(templateEntries || null),
      };
    }, {});

const makeTemplateCopyPluginPattern = (templatePath, nestedDestPath = '/') => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/templates${nestedDestPath}[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

const makeSnippetCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

const makeSectionCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

module.exports = {
  makeTemplatesEntryPoints,
  makeSnippetCopyPluginPattern,
  makeJsEntryPoints,
  makeTemplateCopyPluginPattern,
  makeSectionCopyPluginPattern,
  getDirNames,
};
