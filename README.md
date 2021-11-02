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

#Contributing
For help on setting up the repo locally, building, testing, and contributing please see CONTRIBUTING.md.

#Code of Conduct
All developers who wish to contribute through code or issues, take a look at the [Code of Conduct](https://github.com/spiral/shopify-starter-kit/blob/master/CODE_OF_CONDUCT).

#License
Copyright (c) 2021 SpiralScout. See [LICENSE](https://github.com/spiral/shopify-starter-kit/blob/master/LICENSE) for further details.
