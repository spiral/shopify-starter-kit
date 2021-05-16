# shopify-front-boilerplate

Boilerplate for the large Shopify repository. 
Repository makes it easier to work with the distribution of files in the project and automates some tasks


Dev technologies and tools
- Webpack
- Scss
- Jest
- Lint code with eslint
- Auto formatting code with Prettier
- Git hooks with husky
 

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


## [Shopify Theme Kit](https://shopify.dev/tools/theme-kit)

Do not forget to check theme ids before launching theme kit watcher!
Watch starts a process that will watch the directory for changes and upload them to Shopify

### Starting Up
Install frontend dependencies using npm install

# Project documentation:

### Project Features: [features.md](./docs/features.md)

### Project implementation plan: [plan.md](./docs/plan.md)

### How to use existed theme: [theme.md](./theme/theme.md)
