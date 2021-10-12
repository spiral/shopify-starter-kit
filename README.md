# shopify-starter-kit

Starter theme and environment for the largest Shopify stores.
Repository makes it easier to work with the distribution of files in the project and automates some tasks.
Starter-kit based on Shopify Theme Kit and inspired by Shopify Slate and popular front-end frameworks (React, Vue).


Dev technologies and tools
- Node.js
- Webpack
- Scss
- Stylelint/Eslint*
- Prettier
- Git hooks with husky
- Shopify Theme Kit

---

## Table of contents
* [General info](#Feneral-Info)
* [Getting Started](#Getting-Started)
* [Shopify Theme Kit](#Shopify-Theme-Kit)
* [File Structure Contract](#File-Structure-Contract)
* [Automation](#Automation)
* [Commands](#Commands)
* [Browser support](#Browser-Support)
* [Features implementation plan](#Features-Implementation-Plan)

---

## General info:

// TODO:

---

## Getting Started
For starting core of project you need to do few simple steps:
1. Install frontend dependencies using npm or yarn. `npm install`
2. Then you need to create `config.yml` with correct settings and run command `npm run start`, or `npm run start:prod`.
3. Start you project using npm or yarn `npm run start` or `npm run start:prod`.

After build all changes will be applied into you selected Shopify theme.


## [Shopify Theme Kit](https://shopify.dev/tools/theme-kit)

Do not forget to check theme ids before launching theme kit watcher!
Watch starts a process that will watch the directory for changes and upload them to Shopify.

#### Configuration for themekit:  config.yml

After cloning the repo, copy `config.example.yml` and rename the copy to `config.yml`.
`config.yml` should contain production credentials (the current live theme) and development credentials (the current feature theme).

The current feature theme is the developers's own theme. Starting to work on a new feature the developer must change the **development** theme_id to the corresponding one every time.

For example:

```
development:
  store: [your-store].myshopify.com
  password: [your-api-password]
  theme_id: "[your-theme-id]"
  proxy: http://localhost:3000
```

The **production (live)** `theme_id` must be changed only after the release.
For example:

```
production:
  store: [your-store].myshopify.com
  password: [your-api-password]
  theme_id: "[your-theme-id]"
```

---

## Commands

#### Create component
// TODO


#### Build theme
// TODO


#### Deploy theme
// TODO

## File Structure Contract

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


- ./src/assets: // TODO:
- ./src/customers: // TODO:
- ./src/templates: // TODO:
- ./src/snippets: // TODO:
- ./src/scripts: // TODO:
- ./theme: // TODO:

### Theme

This folder is intended for keeping files of an existing Shopify store.

This project makes it possible to switch to a new code structure not immediately and allows using the capabilities of the boilerplate in part.

---

## Browser support
// TODO:
---

# Contributing
For help on setting up the repo locally, building, testing, and contributing please see CONTRIBUTING.md.

# Code of Conduct
All developers who wish to contribute through code or issues, take a look at the [Code of Conduct](https://github.com/spiral/shopify-starter-kit/blob/master/CODE_OF_CONDUCT).

# License
Copyright (c) 2021 SpiralScout. See [LICENSE](https://github.com/spiral/shopify-starter-kit/blob/master/LICENSE) for further details.
