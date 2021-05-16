const path = require("path");
const fs = require("fs");

const getDirNames = (path) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFilesNames = (path) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const mkSectionsEntryPoints = (templatePath) => {
  const resultEntries = {};

  getDirNames(templatePath).forEach((folderName) => {
    getDirNames(`${templatePath}/${folderName}`).forEach((subFolder) => {
      const fileName = subFolder; // The file should have the same name as its component
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
    .filter((name) => name !== "common")
    .reduce(
      (res, name) => ({
        ...res,
        [name]: path.resolve(__dirname, templatePath, `${name}/${name}.js`),
      }),
      {}
    );

const mkJsEntryPoints = (templatePath) => {
  const simpleFilesEntry = getFilesNames(templatePath).reduce(
    (res, name) => ({
      ...res,
      ...(path.parse(name).ext === ".js"
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

const mkTemplateCopyPlugin = (templatePath) => ({
  from: `${templatePath}/*/*.liquid`,
  to: path.resolve(__dirname, `dist/templates/[name][ext]`),
});

const mkSectionCopyPlugin = (templatePath) => ({
  from: `${templatePath}/*/*/*.liquid`,
  to: path.resolve(__dirname, `dist/sections/[name][ext]`),
});

module.exports = {
  mkSectionsEntryPoints,
  mkTemplateEntryPoints,
  mkJsEntryPoints,
  mkTemplateCopyPlugin,
  mkSectionCopyPlugin,
};