const path = require('path');
const fs = require('fs');

const getDirNames = (_path) =>
  fs
    .readdirSync(_path, { withFileTypes: true })
    .filter(Boolean)
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFilesNames = (_path) =>
  fs
    .readdirSync(_path, { withFileTypes: true })
    .filter(Boolean)
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const mkTemplateEntryPoints = (templatePath) =>
  getDirNames(templatePath)
    .filter((name) => name !== 'common')
    .reduce((res, name) => {
      const filePath = path.resolve(
        __dirname,
        templatePath,
        `${name}/${name}.js`
      );

      if (!fs.existsSync(filePath)) {
        return res;
      }

      return {
        ...res,
        [name]: filePath,
      };
    }, {});

const mkJsEntryPoints = (templatePath) => {
  const simpleFilesEntry = getFilesNames(templatePath).reduce(
    (res, name) => ({
      ...res,
      ...(path.parse(name).ext === '.js'
        ? {
            [path.parse(name).name]: path.resolve(
              __dirname,
              templatePath,
              name
            ),
          }
        : null),
    }),
    {}
  );

  const nestedFilesEntry = getDirNames(templatePath).reduce(
    (res, name) => ({
      ...res,
      ...mkJsEntryPoints(path.resolve(templatePath, name)),
    }),
    {}
  );

  return {
    ...simpleFilesEntry,
    ...nestedFilesEntry,
  };
};

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
