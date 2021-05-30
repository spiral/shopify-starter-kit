const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  async prompting() {
    const self = this;
    self.answers = await self.prompt([
      {
        type: "input",
        name: "name",
        message: "Your snippet name",
        default: "",
      },
    ]);
  }

  async writing() {
    const self = this;
  
    if (self.answers.name) {
      self.fs.copyTpl(
        self.templatePath("snippet_example"),
        self.destinationPath(`./src/snippets${self.answers.name}`),
        { name: self.answers.name }
      );
    }
  }

  async end() {
    self.log(`creating snippet ${self.answers.name}`);
  }
};
