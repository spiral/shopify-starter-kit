// eslint-disable-next-line import/no-extraneous-dependencies
const { startCase, toLower } = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const rename = require('gulp-rename');
// eslint-disable-next-line import/no-extraneous-dependencies
const Generator = require('yeoman-generator');
const path = require('path');
const { getDirNames } = require('../webpack-helpers');

const COMPONENT_TYPES = {
  SNIPPET: 'snippet',
  SECTION: 'section',
  TEMPLATE: 'template',
  CUSTOMER_TEMPLATE: 'customer',
};

const COMPONENT_TYPES_ORDER = [
  COMPONENT_TYPES.SNIPPET,
  COMPONENT_TYPES.SECTION,
  COMPONENT_TYPES.TEMPLATE,
  COMPONENT_TYPES.CUSTOMER_TEMPLATE,
];

const TEMPLATE_TYPE_OUTPUT_MAP = {
  [COMPONENT_TYPES.TEMPLATE]: 'templates',
  [COMPONENT_TYPES.CUSTOMER_TEMPLATE]: 'customers',
};

module.exports = class extends Generator {
  async prompting() {
    const self = this;

    self.answers = await self.prompt([
      {
        type: 'list',
        name: 'component',
        message: 'Who do you want to generate?',
        choices: COMPONENT_TYPES_ORDER,
        default: COMPONENT_TYPES.SNIPPET,
      },
      {
        type: 'input',
        name: 'snippet_name',
        message: 'Enter your snippet name',
        when(answers) {
          return answers.component === COMPONENT_TYPES.SNIPPET;
        },
        default: '',
      },
      {
        type: 'list',
        name: 'template_type',
        message: 'Do you want to add customer section?',
        choices: [COMPONENT_TYPES.TEMPLATE, COMPONENT_TYPES.CUSTOMER_TEMPLATE],
        when(answers) {
          return answers.component === COMPONENT_TYPES.SECTION;
        },
        default: COMPONENT_TYPES.TEMPLATE,
      },
      {
        type: 'list',
        name: 'section_related',
        message: 'Please select section destination?',
        choices: getDirNames('./src/templates'),
        when(answers) {
          return answers.template_type === COMPONENT_TYPES.TEMPLATE;
        },
        default: 'common',
      },
      {
        type: 'list',
        name: 'section_related',
        message: 'Please select section destination?',
        choices: getDirNames('./src/customers'),
        when(answers) {
          return answers.template_type === COMPONENT_TYPES.CUSTOMER_TEMPLATE;
        },
        default: 'account',
      },
      {
        type: 'input',
        name: 'section_name',
        message: 'Enter your section name (with prefix)',
        when(answers) {
          return answers.component === COMPONENT_TYPES.SECTION;
        },
        default: '',
      },
      {
        type: 'list',
        name: 'template_prefix',
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
          return answers.component === COMPONENT_TYPES.TEMPLATE;
        },
        default: 'page',
      },
      {
        type: 'list',
        name: 'template_prefix',
        message: 'Choose customer template prefix',
        choices: [
          'account',
          'activate_account',
          'addresses',
          'login',
          'order',
          'register',
          'reset_password',
        ],
        when(answers) {
          return answers.component === COMPONENT_TYPES.CUSTOMER_TEMPLATE;
        },
        default: '',
      },
      {
        type: 'input',
        name: 'template_name',
        message: `Enter your template name (without prefix)`,
        when(answers) {
          return (
            answers.component === COMPONENT_TYPES.TEMPLATE ||
            answers.component === COMPONENT_TYPES.CUSTOMER_TEMPLATE
          );
        },
        default(answers) {
          return `${answers.template_prefix}.`;
        },
      },
      {
        type: 'confirm',
        name: 'has_hero_section',
        message: 'Do you want to add hero section?',
        when(answers) {
          return (
            answers.component === COMPONENT_TYPES.TEMPLATE ||
            answers.component === COMPONENT_TYPES.CUSTOMER_TEMPLATE
          );
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

    if (self.answers.component === COMPONENT_TYPES.SNIPPET) {
      this.createSnippet({ name: self.answers.snippet_name });
    }

    if (self.answers.component === COMPONENT_TYPES.SECTION) {
      this.createSection({
        name: self.answers.section_name,
        templateName: self.answers.section_related,
        templateType: TEMPLATE_TYPE_OUTPUT_MAP[self.answers.template_type],
      });
    }

    if (
      self.answers.component === COMPONENT_TYPES.TEMPLATE ||
      self.answers.component === COMPONENT_TYPES.CUSTOMER_TEMPLATE
    ) {
      this.createTemplate({
        name: self.answers.template_name,
        prefix: self.answers.template_prefix,
        templateType: TEMPLATE_TYPE_OUTPUT_MAP[self.answers.component],
        hasHeroSection: self.answers.has_hero_section,
      });
    }
  }

  async createSnippet({ name } = {}) {
    const self = this;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('snippet'),
        self.destinationPath(`./src/snippets/${name}`),
        { name }
      );
    }
  }

  async createSection({ name, templateName = 'common', templateType } = {}) {
    const self = this;

    if (name) {
      self.fs.copyTpl(
        self.templatePath('section'),
        self.destinationPath(`./src/${templateType}/${templateName}/${name}`),
        {
          name,
          schemaName: startCase(toLower(name)),
        }
      );
    }
  }

  async createTemplate({
    name,
    prefix,
    templateType,
    hasHeroSection = false,
  } = {}) {
    const self = this;

    const pageName = name ? `${prefix}-${name}` : prefix;
    const templateName = name ? `${prefix}.${name}` : prefix;

    const sectionName = hasHeroSection ? `${pageName}-hero` : null;

    if (templateName) {
      self.fs.copyTpl(
        self.templatePath('template'),
        `./src/${templateType}/${templateName}`,
        {
          name: `${templateName}`,
          className: pageName,
          sectionName,
        }
      );

      if (sectionName) {
        this.createSection({
          name: sectionName,
          templateName,
          templateType,
        });
      }
    }
  }

  async end() {
    const self = this;
    const {
      snippet_name: snippetName,
      section_name: sectionName,
      template_prefix: templatePrefix,
      template_name: templateName,
      component,
    } = self.answers;

    const COMPONENTS_NAME_MAP = {
      [COMPONENT_TYPES.SNIPPET]: snippetName,
      [COMPONENT_TYPES.SECTION]: sectionName,
      [COMPONENT_TYPES.TEMPLATE]: `${templatePrefix}.${templateName}`,
      [COMPONENT_TYPES.CUSTOMER_TEMPLATE]: `${templatePrefix}.${templateName}`,
    };

    self.log(`creating ${component}: ${COMPONENTS_NAME_MAP[component]}`);
  }
};
