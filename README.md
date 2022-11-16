# Shopify-starter-kit

**Shopify starter kit** is the starter theme and development environment for the largest Shopify stores.
Repository makes it easier to work with the distribution of files in the project and automates some tasks.
**Shopify starter kit** based on [Shopify Themekit](https://github.com/Shopify/themekit) and inspired by Shopify [Slate](https://github.com/Shopify/slate) and popular front-end frameworks like a React and Vue.


**Shopify starter kit** is built with using technologies and tools:

- Node.js `^14.15.0`
- NPM `^7.0.0`
- Webpack 
- SASS 
- Eslint, Stylelint
- Git hooks with prettier + lint-staged
- Shopify Themekit
- Github CI / Gitlab CI

---

## Table of contents

* [General info](#General-Info)
  - Shopify starter kit in [Basic mode](#basic-mode)
  - Shopify starter kit in [Advanced mode](#advanced-mode)
* [Getting Started](#Getting-Started)
* [Shopify Themekit](#Shopify-Themekit)
    - [Configuration for themekit](#configuration-for-Themekit)
* [File Structure Contract](#File-Structure-Contract)
  - [Folders descriptions](#folders-descriptions)
* [Commands](#Commands)



## General info

**Shopify starter kit** is a tool for comfortable team development of Shopify stores. 
The main goal of our team was to facilitate the start of new projects. 
For us, this means a quick start, the use of latest js standards and the use of teamwork tools. 
We tried to collect the most important things in one place - this is how the **Shopify starter kit** turned out.

**Shopify starter kit** support 2 ways to use: [**basic**](#basic-mode) and [**advanced**]((#advanced-mode)) modes.

### Basic mode


👍 We recommend to use Basic mode for casual projects.

Basic mode of **Shopify starter kit** includes [Dawn](https://github.com/Shopify/dawn) theme by default, 
but you can use any of Shopify themes from your own stores. 
For custom theme you need just replace files from theme folder to the theme files. 

If you want to use js and css linters for `./theme` folder, please go to package.json,
find `deploy` and `deploy:prod` commands and replace `lint` to `lint:all` in related strings.

For using this mode, you need to follow a few simple steps:
1. Clone this repo to own project folder
2. Install dependencies
3. Set actual data to the config.yml file
4. Clean `./theme` folder (if you want to use own Shopify theme)
5. Download current Shopify store with the command `npm run download:theme`
Then all your store files will be placed into the `./theme` folder and everything is ready to go.

All new functionality (scripts and styles) you can add directly to `./src` folder. 
After the build they must be processed and placed in `./dist/assets` as build artifacts. 
We are using webpack: `mini-css-extract-plugin` for build style files, and it should work for you.

❗**NOTE**: If you need to build only js scripts for theme, you don't need to clean up the whole src folder.
You should keep a `src/scripts`. The files in this folder were processed by linters and builders.


### Advanced mode

Advanced Mode provides a powerful set for building Shopify stores.
This mode makes it easier to work with store pages.
An advanced file structure allows you to separate the code between pages
and load only the necessary functionality on the page, which increases the speed of the site. 
The structure also makes it easier to find and fix problems in the code,
which speeds up the work of developers.

The advanced mode allows you to use all features of the **Shopify starter kit**:
- Using the latest JS standard in script files
- Fixed component structure support
- CLI for generating components
- Separation of styles between pages, which allows optimization loading of styles and scripts, code splitting
- Placing page styles directly in templates to speed up page loading
- Using linting and code styling tools
- Customized auto-corrections style code at the time of commit creation
- Prepared CI/CD for github and gitlab repos

All templates in `./src` folder are based on Shopify starter theme and provide **BEM** naming methodology (Block, Element, Modifier).
Advanced mode supports partial relocation to the new structure and all files in `./theme` folder will work fine.

❗**NOTE**: This mod is only suitable for those stores where no code changes are expected in the admin panel.
In advanced mode, at the moment there is no way to do full syncing with the existing store. 
All files downloaded from the existing store will be placed in the `./theme` folder and there will be no replacement in the structure

---

## Getting Started

For starting core of project you need to do few simple steps:
1. Clone this repo,
2. Install dependencies using npm or yarn. `npm install`,
3. Create config file: `config.yml` with correct settings. Can use the `config.example.yml` as example,
4. Start you project using npm or yarn `npm run start` or `npm run start:prod`.

After build all changes will be applied into you selected Shopify theme.
Additional information you can find in the [Shopify Themekit](#Shopify-Themekit) block.


## [Shopify Themekit](https://github.com/Shopify/themekit)

Don't forget to check theme ids before launching theme kit watcher❗
The command `watch` starts a process that will watch the directory for changes and upload them to Shopify.

#### Configuration for Themekit

After cloning the repo, copy `config.example.yml` and rename the copy to `config.yml`.
The file `config.yml` should contain development credentials (the current feature theme).
The production credentials (the current live theme) is optional.

The current feature theme is the developers's own theme. Starting to work on a new feature the developer must change the **development** `theme_id` to the corresponding one every time.

```
development:
  store: [your-store].myshopify.com
  password: [your-api-password]
  theme_id: "[your-theme-id]"
  ignore_files:
    - config/settings_data.json
```

---

## Commands

The **Shopify starter kit** contains many commands for working on a project. 
Most theme commands are short names for the Shopify [Themekit](https://github.com/Shopify/themekit). 
However, most of it allows you to work with the project itself. Just a few basic commands are described below. 
A complete list of commands can be found in the `package.json` file.

#### Commands short list:

* [Download](#Download)
* [Start](#Start)
* [Build](#Build)
* [Deploy](#Deploy)
* [Creating components](#Creating-components)
* [Analyze](#Analyze)

#### Download

The commands to download the existed Shopify stores.
We have 2 commands to download theme:

```bash
npm run theme:download
```

or 

```bash
npm run theme:download:prod
```

`theme:download` related to development environment part of your config.yml file, 

`theme:download:prod` related to production environment.

---

#### Start

Start command will run a webpack watcher, the Themekit deploy watcher and open a development store in new browser window.
By default, this command runs only for development environment.

```bash
npm run start
```

---

#### Build

The `build` command prepare all files for deploy. 
All files will be processed and placed into `./dist` folder.
There are supported development and production modes.

```bash
npm run build
```

or

```bash
npm run build:prod
```

The `build` command is shorthand for `webpack` run script. 
By default, it starts with a `--progress` flag.

---

#### Deploy

Command for uploading all files from `./dist` folder to your Shopify store. 
Based on [Themekit](https://github.com/Shopify/themekit).

```bash
npm run deploy
```

or

```bash
npm run deploy:prod
```

Deploy command it is shorthand of few base commands: `lint`, `build`, and [Themekit](https://github.com/Shopify/themekit) `deploy`.

---

#### Creating components

The **Shopify starter kit** provides the CLI to creating new entities in own structures.
CLI is based on `yeoman` generator and can be started with the `yo` command. 
CLI is supported to creating style, script and liquid files for templates, section, snippets.
All templates already used scripts and styles inside the `liquid` files.
You can expand or change it in the `generator` folder after cloning **Shopify starter kit**.

```bash
npm run gen
```


---

#### Analyze
It is CLI command for profiling js assets.
Analyze is the shortcut for two commands: `webpack --profile` and run [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer).
You can find more details about profiling in webpack docs [webpack profile](https://webpack.js.org/configuration/other-options/#profile).

```bash
npm run analyze
```

or

```bash
npm run analyze:prod
```

## File Structure Contract

The file structure contract is the main feature of **Shopify starter kit**. 

❗This structure only supports with advanced mode.
The synchronization between Shopify store and file structure doesn't work yet.

```
/src
 ├── assets
 |    └── index.js
 ├── customers
 |    └── customer-template
 |         ├── section-name
 |         |    ├── section-name.js
 |         |    ├── section-name.liquid
 |         |    └── section-name.scss
 |         ├── customer-template.js
 |         ├── customer-template.liquid
 |         └── customer-template.scss
 ├── templates
 |    ├── common
 |    |    └── common-section-name
 |    |         ├── common-section-name.js
 |    |         ├── common-section-name.liquid
 |    |         └── common-section-name.scss
 |    └── template-name
 |         ├── section-name
 |         |    ├── section-name.js
 |         |    ├── section-name.liquid
 |         |    └── section-name.scss
 |         ├── template-name.js
 |         ├── template-name.liquid
 |         └── template-name.scss
 ├── scripts
 └── snippets
      └── snippet-name
           ├── snippet-name.js
           ├── snippet-name.luqiid
           └── snippet-name.scss
/theme
```

Js files is optional for sections and template. 
Please remove this files (and import them into the template) after generation for make you codebase smaller.

---

### Folders descriptions:

`./src/assets` - folder for assets. They might be images, fonts, any necessary files for Shopify store. 
The same as default Shopify assets folder.
By default, files from this folder will be copied to `dist` without modification.
In production mode images will be compressed.

`./src/customers` - folders for customer templates. Optional.

`./src/templates` - include all store pages with necessary styles and scripts.
Each page should include its own sections. 
By default, all templates use scripts and styles as webpack entry points.

`./src/snippets` - are regular snippets with own styles. 
The styles of each snippet can be included in section, template or theme. 
By default, snippets styles or scripts are unwatched.

`./src/scripts` - the main folder functionality. 
All js files in this folder will be processed with wabpack and placed in `./dist/assets`. 
Can't be empty.

`./theme` - folder for all Shopify files, used in base mode. 
All files from this folder will be copied to dist without changes. 
It is recommended to use the `npm run gen` command to add new components.

---

# Contributing

For help on setting up the repo locally, building, testing, and contributing please see [CONTRIBUTING.md](https://github.com/spiral/shopify-starter-kit/blob/master/CONTRIBUTING.md).

# Code of Conduct

All developers who wish to contribute through code or issues, take a look at the [CODE_OF_CONDUCT.md](https://github.com/spiral/shopify-starter-kit/blob/master/CODE_OF_CONDUCT.md).

# License

Copyright (c) 2021 SpiralScout. See [LICENSE](https://github.com/spiral/shopify-starter-kit/blob/master/LICENSE) for further details.
