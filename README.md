# jest-preset-stylelint

[![NPM version](https://img.shields.io/npm/v/jest-preset-stylelint.svg)](https://www.npmjs.org/package/jest-preset-stylelint) [![Build Status](https://github.com/stylelint/jest-preset-stylelint/workflows/CI/badge.svg)](https://github.com/stylelint/jest-preset-stylelint/actions)

[Jest](https://jestjs.io/) preset for [Stylelint](https://stylelint.io/) plugins.

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

If your plugin is written as an ESM, you'll need to use the `--experimental-vm-modules` flag:

```json
{
  "scripts": {
    "test": "cross-env NODE_OPTIONS=\"--experimental-vm-modules --no-warnings\" jest --runInBand"
  }
}
```

(cross-env is in maintenance-mode as it's [considered finished](https://github.com/kentcdodds/cross-env/issues/257#issue-754591323).)

### Adjust setup globally

Optionally, you can avoid specifying `plugins` in every schema by defining your own setup file to configure the `testRule`/`testRuleConfigs` functions.
This is useful if you have many tests. There are two additional steps to do this:

1. Create `jest.setup.js` in the root of your project. Provide `plugins` option to `getTestRule`/`getTestRuleConfigs`:

   ```js
   import { getTestRule, getTestRuleConfigs } from "jest-preset-stylelint";
   import myPlugin from "./my-plugin.js";

   const plugins = [myPlugin];

   global.testRule = getTestRule({ plugins });
   global.testRuleConfigs = getTestRuleConfigs({ plugins });
   ```

2. Add `jest.setup.js` to your `jest.config.js` or `jest` field in `package.json`:

   ```json
   {
     "preset": "jest-preset-stylelint",
     "setupFiles": ["<rootDir>/jest.setup.js"]
   }
   ```

### Prevent segmentation fault

If you get a segmentation fault while running the preset on Node.js 18, you can use [jest-light-runner](https://www.npmjs.com/package/jest-light-runner):

```json
{
  "preset": "jest-preset-stylelint",
  "runner": "jest-light-runner"
}
```

## Usage

This preset exposes the following global functions as a helper.

See also the [type definitions](index.d.ts) for more details.

### `testRule`

The `testRule` function enables you to efficiently test your plugin using a schema.

For example, we can test a plugin that enforces and autofixes kebab-case class selectors:

```js
// my-plugin.test.js
import myPlugin from "./my-plugin.js";

const plugins = [myPlugin];
const {
  ruleName,
  rule: { messages }
} = myPlugin;

testRule({
  plugins,
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

### `testRuleConfigs`

The `testRuleConfigs` function enables you to test invalid configs for a rule.

For example:

```js
testRuleConfigs({
  plugins,
  ruleName,

  accept: [
    {
      config: "valid"
    }
  ],

  reject: [
    {
      config: "invalid"
    },
    {
      config: [/invalid/],
      description: "regex is not allowed"
    }
  ]
});
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
