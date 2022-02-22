# jest-preset-stylelint

[![NPM version](https://img.shields.io/npm/v/jest-preset-stylelint.svg)](https://www.npmjs.org/package/jest-preset-stylelint) [![Build Status](https://github.com/stylelint/jest-preset-stylelint/workflows/CI/badge.svg)](https://github.com/stylelint/jest-preset-stylelint/actions)

[Jest](https://facebook.github.io/jest/) preset for [Stylelint](https://github.com/stylelint) plugins.

## Installation

Install the preset alongside Jest and Stylelint:

```bash
npm install jest-preset-stylelint jest stylelint --save-dev
```

## Setup

Add the preset to your `jest.config.js` or `jest` field in `package.json`:

```json
{
  "preset": "jest-preset-stylelint"
}
```

Optionally, you can avoid specifying `plugins` in every schema by defining your own setup file to configure the `testRule` function. This is useful if you have many tests. There are two additional steps to do this:

1. Create `jest.setup.js` in the root of your project. Provide `plugins` option to `getTestRule()`:

   ```js
   const { getTestRule } = require("jest-preset-stylelint");

   global.testRule = getTestRule({ plugins: ["./"] });
   ```

2. Add `jest.setup.js` to your `jest.config.js` or `jest` field in `package.json`:

   ```json
   {
     "preset": "jest-preset-stylelint",
     "setupFiles": ["jest.setup.js"]
   }
   ```

## Usage

The preset exposes a global `testRule` function that you can use to efficiently test your plugin using a schema.

For example, we can test a plugin that enforces and autofixes kebab-case class selectors:

```js
// my-plugin.test.js
const { messages, ruleName } = require(".");

testRule({
  plugins: ["."],
  ruleName,
  config: [true, { type: "kebab" }],
  fix: true,

  accept: [
    {
      code: ".class {}",
      description: "simple class selector"
    },
    {
      code: ".my-class {}",
      description: "kebab class selector"
    }
  ],

  reject: [
    {
      code: ".myClass {}",
      fixed: ".my-class {}",
      description: "camel case class selector",
      message: messages.expected(),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 8
    },
    {
      code: ".MyClass,\n.MyOtherClass {}",
      fixed: ".my-class,\n.my-other-class {}",
      description: "two pascal class selectors in a selector list",
      warnings: [
        {
          message: messages.expected(),
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 8
        },
        {
          message: messages.expected(),
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 13
        }
      ]
    }
  ]
});
```

## Schema properties

See the [type definitions](index.d.ts).

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
