// eslint-disable-next-line import/no-extraneous-dependencies
const { startCase, toLower } = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const rename = require('gulp-rename');
// eslint-disable-next-line import/no-extraneous-dependencies
const Generator = require('yeoman-generator');
const path = require('path');
const { getDirNames } = require('../webpack-helpers');

module.exports = class extends Generator {
  async prompting() {
    const self = this;

    self.answers = await self.prompt([
      {
        type: 'list',
        name: 'component',
        message: 'Who do you want to generate?',
        choices: ['snippet', 'section', 'template'],
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
        name: 'template',
        message: 'Please select section destination?',
        choices: getDirNames('./src/templates'),
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
        name: 'template_name',
        message: 'Choose template prefix',
        choices: [
          '404',
          'article',
          'blog',
          'cart',
          'collection',
          'gift_card',
          'list-collections',
          'index',
          'page',
          'password',
          'product',
          'search',
        ],
        when(answers) {
          return answers.component === 'template';
        },
        default: 'page',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter your template name',
        default: '',
        when(answers) {
          return answers.component === 'template';
        },
      },
      {
        type: 'confirm',
        name: 'has_hero_section',
        message: 'Do you want to add hero section?',
        when(answers) {
          return answers.component === 'template';
        },
        default: false,
      },
    ]);
  }

  async writing() {
    const self = this;

    self.queueTransformStream(
      rename((_path) => {
        const lastName = path.basename(_path.dirname);

        // eslint-disable-next-line no-param-reassign
        _path.basename = _path.basename.replace(/(index)/g, lastName);
      })
    );

    if (self.answers.component === 'snippet') {
      this.createSnippet(self.answers.name);
    }

    if (self.answers.component === 'section') {
      this.createSection(self.answers.name, self.answers.template);
    }

    if (self.answers.component === 'template') {
      this.createTemplate(
        self.answers.name,
        self.answers.template_name,
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

  async createSection(name, template = 'common') {
    const self = this;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('section'),
        self.destinationPath(`./src/templates/${template}/${name}`),
        {
          name,
          schemaName: startCase(toLower(name)),
        }
      );
    }
  }

  async createTemplate(name, prefix, hasHeroSection) {
    const self = this;

    const pageName = name ? `${prefix}-${name}` : prefix;
    const fileName = name ? `${prefix}.${name}` : prefix;

    if (fileName) {
      self.fs.copyTpl(
        self.templatePath('template'),
        `./src/templates/${fileName}`,
        {
          name: `${fileName}`,
          className: pageName,
          sectionName: hasHeroSection ? `${pageName}-hero` : null,
        }
      );

      if (hasHeroSection) {
        this.createSection(`${pageName}-hero`, fileName);
      }
    }
  }

  async end() {
    const self = this;

    self.log(`creating ${self.answers.component}: ${self.answers.name}`);
  }
};
