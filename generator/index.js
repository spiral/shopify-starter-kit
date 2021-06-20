const Generator = require("yeoman-generator");
const rename = require('gulp-rename')

module.exports = class extends Generator {
  async prompting() {
    const self = this;
    self.answers = await self.prompt([
      {
        type: "list",
        name: "component",
        message: "Who do you want to generate?",
        choices: [
          "section",
          "snippet",
          "page"
        ],
        default: "snippet",
      },
      {
        type: "input",
        name: "name",
        message: "Enter your component name",
        default: "",
      },
    ]);
  }
  
  async writing() {
    const self = this;
  
    self.registerTransformStream(
      rename(function (path) {
        path.basename = path.basename.replace(/(index)/g, self.answers.name)
      })
    );
    
    self.log(`writing ${JSON.stringify(self.answers)}`);
  
    if (self.answers.name) {
      const template = self.answers.component
      const templateSrc = `${self.answers.component}s`
      
      self.fs.copyTpl(
        self.templatePath(template),
        self.destinationPath(`./src/${templateSrc}/${self.answers.name}`),
        {name: self.answers.name}
      );
    }
  }

  async end() {
    const self = this;

    self.log(`creating ${self.answers.component}: ${self.answers.name}`);
  }
};
