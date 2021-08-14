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

const mkSectionsEntryPoints = (templatePath) => {
  const resultEntries = {};

  getDirNames(templatePath)
    .filter(Boolean)
    .forEach((folderName) => {
      getDirNames(`${templatePath}/${folderName}`)
        .filter(Boolean)
        .forEach((subFolder) => {
          // The file should have the same name as its component
          const fileName = subFolder;
          const filePath = path.resolve(
            __dirname,
            templatePath,
            `${folderName}/${subFolder}/${fileName}.js`
          );

          if (fs.existsSync(filePath)) {
            resultEntries[fileName] = filePath;
          }
        });
    });

  return resultEntries;
};

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

const mkTemplateCopyPlugin = (templatePath) => {
  const destPath =
    templatePath.split('/').pop() === 'customers'
      ? 'customers/[name][ext]'
      : '[name][ext]';

  return {
    from: `${templatePath}/*/*.liquid`,
    to: `dist/templates/${destPath}`,
    noErrorOnMissing: true,
    globOptions: {
      ignore: ['.gitkeep'],
    },
  };
};

const mkSnippetCopyPlugin = (templatePath) => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/snippets/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

const mkSectionCopyPlugin = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`),
  noErrorOnMissing: true,
  globOptions: {
    ignore: ['.gitkeep'],
  },
});

module.exports = {
  mkSectionsEntryPoints,
  mkTemplateEntryPoints,
  mkSnippetCopyPlugin,
  mkJsEntryPoints,
  mkTemplateCopyPlugin,
  mkSectionCopyPlugin,
  getDirNames,
};
