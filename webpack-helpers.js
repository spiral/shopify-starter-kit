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

const mkEntryPointsFactory =
  (_ext) =>
  (templatePath, filterCb = null) =>
    getFilesNames(templatePath).reduce((res, name) => {
      const isRelatedFile = path.parse(name).ext === _ext;
      const isFilteredFile = filterCb ? filterCb(name) : true;

      if (!isRelatedFile || !isFilteredFile) {
        return res;
      }

      return {
        ...res,
        [path.parse(name).name]: path.resolve(__dirname, templatePath, name),
      };
    }, {});

const mkJsEntryPoints = mkEntryPointsFactory('.js');
const mkScssEntryPoints = mkEntryPointsFactory('.scss');

const mkTemplateEntryPoints = (templatePath) =>
  getDirNames(templatePath)
    .filter((name) => name !== 'common')
    .reduce((res, dirName) => {
      const templateJsEntries = mkJsEntryPoints(
        path.resolve(templatePath, dirName),
        (name) => name.includes(dirName)
      );

      const templateScssEntries = mkScssEntryPoints(
        path.resolve(templatePath, dirName),
        (name) => name.includes(dirName)
      );

      return {
        ...res,
        ...(templateScssEntries || null),
        ...(templateJsEntries || null),
      };
    }, {});

const mkTemplateCopyPluginPattern = (templatePath, nestedDestPath = '/') => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/templates${nestedDestPath}[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

const mkSnippetCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

const mkSectionCopyPluginPattern = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

module.exports = {
  mkTemplateEntryPoints,
  mkSnippetCopyPluginPattern,
  mkJsEntryPoints,
  mkTemplateCopyPluginPattern,
  mkSectionCopyPluginPattern,
  getDirNames,
};
