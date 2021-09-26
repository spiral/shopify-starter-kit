# shopify-starter-kit

Starter theme and environment for the largest Shopify stores. 
Repository makes it easier to work with the distribution of files in the project and automates some tasks.


Dev technologies and tools
- Webpack
- Scss
- Jest
- Lint code with eslint*
- Auto formatting code with Prettier
- Git hooks with husky
- Shopify-themekit*

*Need to install shopify-themekit and eslint global.

## [Shopify Theme Kit](https://shopify.dev/tools/theme-kit)

Do not forget to check theme ids before launching theme kit watcher!
Watch starts a process that will watch the directory for changes and upload them to Shopify.

## config.yml

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

# Starting Up
Install frontend dependencies using npm install.
Then you need to create `config.yml` with correct settings and run command `npm run start`, or `npm run start:prod`. 
After build all changes will be applied into you selected Shopify theme.


# Project documentation:

---

### Browser support

// TODO:

---

### Command

// TODO:

---

### FILE STRUCTURE CONTRACT

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


### Create component
// TODO


### Build theme
// TODO


### Deploy theme
// TODO


---

## Project features implementation plan: 


#### Features:

- [x] File Structure
- [x] Single Code Style linting
- [x] Scripts and Styles Processing
- [x] JS transpiling
- [x] Assets Building
- [x] Implements shopify theme-kit
- [x] Jest test environment
- [x] Run Lint and Format code on pre-commit
- [x] Compress images
- [ ] Dev Server
- [x] File structure and build flow for customers templates
- [x] Download existed Shopify Store into theme folder

---
#### Automation:

- [x] Add Components
- [ ] Change/Move Components
- [x] Runtime Processing files
- [x] Files Checking
- [ ] Git Release Automation

---
#### Pages load time optimisation

- [x] Loading required styles
- [x] Loading required scripts
- [ ] Styles prefetch
- [ ] Scripts prefetch

---
#### Research and develop

- [ ] Use autoprefixer for styles
- [ ] Find the possibility to use strong prettier rules for liquid files
- [ ] Add base vue.js environment
- [x] Add webpack analyzer

etc.

---
