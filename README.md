# jest-preset-stylelint

[![NPM version](https://img.shields.io/npm/v/jest-preset-stylelint.svg)](https://www.npmjs.org/package/jest-preset-stylelint) [![Build Status](https://github.com/stylelint/jest-preset-stylelint/workflows/CI/badge.svg)](https://github.com/stylelint/jest-preset-stylelint/actions)

[Jest](https://facebook.github.io/jest/) preset for [stylelint](https://github.com/stylelint) plugins.

## Installation

Install the preset alongside jest and stylelint:

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
      column: 1
    },
    {
      code: ".MyClass,\n.MyOtherClass {}",
      fixed: ".my-class,\n.my-other-class {}",
      description: "two pascal class selectors in a selector list",
      warnings: [
        {
          message: messages.expected(),
          line: 1,
          column: 1
        },
        {
          message: messages.expected(),
          line: 2,
          column: 1
        }
      ]
    }
  ]
});
```

## Schema properties

### `accept` \[array\<Object\>\]

Accept test cases.

### `config` \[array\]

Config to pass to the rule.

### `fix` \[boolean\]

Default: `false` (Optional).

Turn on autofix.

### `plugins` \[array\<string\>\]

Maps to stylelint's [`plugins` configuration property](https://stylelint.io/user-guide/configure#plugins).

Path to the file that exports the plugin object, relative to the root.

If you're testing a plugin pack, it's the path to the file that exports the array of plugin objects.

### `reject` \[array\<Object\>\]

Reject test cases.

### `rulename` \[string\]

Name of the rule being tested. Usually exported from the plugin.

### `skipBasicChecks` \[boolean\]

Default: `false` (Optional).

Skip [basic checks](https://github.com/stylelint/stylelint/blob/master/lib/testUtils/basicChecks.js), e.g. an empty source.

### `syntax` \<string\>

Maps to stylelint's [`syntax` option](https://stylelint.io/user-guide/usage/options#syntax).

## Shared test case properties

Used within both `accept` and `reject` test cases.

### `code` \[string\]

The code of the test case.

### `description` \[string\]

Optional.

Description of the test case.

### `skip` \[boolean\]

Default: `false` (Optional).

Maps to Jest's [test.skip](https://jestjs.io/docs/en/api#testskipname-fn).

### `only` \[boolean\]

Default: `false` (Optional).

Maps to Jest's [test.only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout).

## Reject test case properties

Use the `warnings` property, rather than `message`, `line` and `column`, if the test case is expected to produce more than one warning.

### `column` \[number\]

Optional.

Expected column number of the warning.

### `fixed` \[string\]

Optional if `fix` isn't `true`.

Expected fixed code of the test case.

### `line` \[number\]

Optional.

Expected line number of the warning.

### `message` \[string\]

Optional if `warnings` is used.

Expected message from the test case. Usually exported from the plugin.

### `unfixable` \[boolean\]

Default: `false` (Optional).

Don't check the `fixed` code.

### `warnings` \[array\<Object\>\]

Optional if `message` is used.

Warning Objects containing expected `message`, `line` and `column`.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
