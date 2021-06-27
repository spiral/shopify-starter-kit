// eslint-disable-next-line import/no-extraneous-dependencies
const { startCase, toLower } = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const rename = require('gulp-rename');
const Generator = require('yeoman-generator');
const { getDirNames } = require('../webpack-helpers');

module.exports = class extends Generator {
  async prompting() {
    const self = this;

    self.answers = await self.prompt([
      {
        type: 'list',
        name: 'component',
        message: 'Who do you want to generate?',
        choices: ['snippet', 'section', 'page'],
        default: 'snippet',
      },
      {
        type: 'list',
        name: 'page',
        message: 'Please select section destination?',
        choices: getDirNames('./src/pages'),
        when(answers) {
          return answers.component === 'section';
        },
        default: 'common',
      },
      {
        type: 'input',
        name: 'name',
        message: `Enter your component name`,
        default: '',
      },
    ]);
  }

  async writing() {
    const self = this;

    self.registerTransformStream(
      rename((_path) => {
        // eslint-disable-next-line no-param-reassign
        _path.basename = _path.basename.replace(/(index)/g, self.answers.name);
      })
    );

    self.log(`writing ${JSON.stringify(self.answers)}`);

    if (self.answers.component === 'snippet') {
      this.createSnippet(self.answers.name);
    }

    if (self.answers.component === 'section') {
      this.createSection(self.answers.name, self.answers.page);
    }
  }

  async createSnippet(name) {
    const self = this;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('snippet'),
        self.destinationPath(`./src/snippets/${name}`),
        { name }
      );
    }
  }

  async createSection(name, page = null) {
    // eslint-disable-next-line no-console
    console.log('createSection', name, page);

    const self = this;

    const schemaName = startCase(toLower(name));
    const mkDestPatch = page
      ? self.destinationPath(`./src/pages/${page}/${name}`)
      : self.destinationPath(`./src/pages/common/${name}`);

    if (name) {
      self.fs.copyTpl(self.templatePath('section'), mkDestPatch, {
        name,
        schemaName,
      });
    }
  }

  async end() {
    const self = this;

    self.log(`creating ${self.answers.component}: ${self.answers.name}`);
  }
};
