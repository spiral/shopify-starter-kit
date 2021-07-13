// eslint-disable-next-line import/no-extraneous-dependencies
const { startCase, toLower } = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const rename = require('gulp-rename');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
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
        type: 'input',
        name: 'name',
        message: 'Enter your snippet name',
        when(answers) {
          return answers.component === 'snippet';
        },
        default: '',
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
        message: 'Enter your section name',
        when(answers) {
          return answers.component === 'section';
        },
        default: '',
      },
      {
        type: 'list',
        name: 'page_prefix',
        message: 'Choose page prefix',
        choices: [
          'article',
          'blog',
          'cart',
          'collection',
          'page',
          'product',
          'search',
        ],
        when(answers) {
          return answers.component === 'page';
        },
        default: 'page',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter your page name',
        default: '',
        when(answers) {
          return answers.component === 'page';
        },
      },
      {
        type: 'confirm',
        name: 'has_hero_section',
        message: 'Do you want to add hero section?',
        when(answers) {
          return answers.component === 'page';
        },
        default: true,
      },
    ]);
  }

  async writing() {
    const self = this;

    self.queueTransformStream(
      rename((_path) => {
        const lastName = path.basename(_path.dirname);

        // eslint-disable-next-line no-param-reassign
        _path.basename = _path.basename.replace(
          /(index)/g,
          lastName.split('_').join('.')
        );
      })
    );

    if (self.answers.component === 'snippet') {
      this.createSnippet(self.answers.name);
    }

    if (self.answers.component === 'section') {
      this.createSection(self.answers.name, self.answers.page);
    }

    if (self.answers.component === 'page') {
      this.createPage(
        self.answers.name,
        self.answers.page_prefix,
        self.answers.has_hero_section
      );
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

  async createSection(name, page = 'common') {
    const self = this;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('section'),
        self.destinationPath(`./src/pages/${page}/${name}`),
        {
          name,
          schemaName: startCase(toLower(name)),
        }
      );
    }
  }

  async createPage(name, prefix, hasHeroSection) {
    const self = this;

    const prefixedName = `${prefix}_${name}`;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('page'),
        `./src/pages/${prefixedName}`,
        {
          name: `${prefix}.${name}`,
          className: prefixedName,
          sectionName: hasHeroSection ? `${name}-hero` : null,
        }
      );

      if (hasHeroSection) {
        this.createSection(`${name}-hero`, prefixedName);
      }
    }
  }

  async end() {
    const self = this;

    self.log(`creating ${self.answers.component}: ${self.answers.name}`);
  }
};
