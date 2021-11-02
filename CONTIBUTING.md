# Contributing Guide


Shopify-starter-kit is an open-source project built for the Shopify Theme community and it needs contributions from the community to be truly successful. We encourage you to join us in our mission of enhancing the Shopify theme development experience!

## Scope

The Shopify-starter-kit Github repo exists for the theme development community to discuss and solve problems. It **is not the place** to discuss general theme development problems.

## How to contribute

If you encounter a bug, think of a useful feature, or find something confusing in the docs, please [create a new issue](https://github.com/spiral/shopify-starter-kit/issues/new)!

We ❤️ pull requests. If you'd like to fix a bug, contribute to a feature or just correct a typo, please feel free to do so, as long as you follow our [Code of Conduct](https://github.com/spiral/shopify-starter-kit/blob/master/CODE_OF_CONDUCT).

If you're thinking of adding a big new feature, consider opening an issue first to discuss it to ensure it aligns to the direction of the project (and potentially save yourself some time!).

## Getting Started

To start working on the codebase:

#### 1. Fork the repo, then clone it:

```
git clone git@github.com:spiral/shopify-starter-kit.git
```

#### 2. Install all package dependencies and link local packages:

```
yarn install
```

This command will install project dependencies and make sure any references to packages use the local versions of those packages instead of the version hosted on NPM.

#### 3. Make some changes and write some tests for those changes. Run the tests with:

```
yarn test
```

#### 4. If your tests pass, commit your changes:

```
git commit -a -m="[#{{ISSUE-NUMBER}}] Your commit message"
```

NOTE: {{ISSUE-NUMBER}} is the number of you issue (#2, #54)

#### 5. Push your commit to your Github fork:

```
git push origin master
```

#### 6. Open a Pull Request

See [Github's official documentation](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for more details.

## Documentation

If your change affects how people use the project (i.e. adding or removing functionality, changing the return value of a function, etc), please ensure [the documentation website](https://shopify.github.io/slate/docs/about) is also updated to reflect this.

The documentation website lives in the [readme](https://github.com/spiral/shopify-starter-kit/blob/master/README) file.
