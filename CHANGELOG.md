# Changelog

## 7.1.1

- Fixed: circular structure in exceptions.

## 7.1.0

- Added: `codeFilename` option to `accept`/`reject` cases in `testRule` function.

## 7.0.1

- Fixed: missing `funding` field in `package.json`.

## 7.0.0

- Removed: support for Node.js less than `18.12.0`.
- Changed: `loadLint` option's default value.

## 6.3.2

- Fixed: missing `getTestRuleConfigs` export.

## 6.3.1

- Fixed: `loadLint` option's type declaration.

## 6.3.0

- Added: `loadLint` option.

## 6.2.0

- Added: `testRuleConfigs` function.

## 6.1.1

- Fixed: tightly-coupled dependency on Stylelint's internal module `lib/utils/getOsEol`.

## 6.1.0

- Added: support for custom unfixable error messages.
- Fixed: false negatives for `invalidOptionWarnings`.

## 6.0.0

- Removed: support for Jest less than `29.0.2` from peer dependencies.
- Removed: support for Node.js less than `14.15.0`.

## 5.0.4

- Fixed: readability of failure output using the Jest `.toMatchObject()` API.

## 5.0.3

- Fixed: peer dependency range for Jest 28.

## 5.0.2

- Fixed: error in TypeScript definitions.

## 5.0.1

- Fixed: incorrect `TestSchema.config` property type.

## 5.0.0

- Removed: `skipBasicChecks` schema property.
- Added: `endLine` and `endColumn` schema properties.
- Added: TypeScript definitions.

## 4.2.0

- Added: `codeFilename` schema property.

## 4.1.1

- Fixed: peer dependency range for jest 27

## 4.1.0

- Added: `only` and `skip` to test group.
- Fixed: peer dependencies and engine range.

## 4.0.0

- Removed: `syntax` schema property.
- Added: `customSyntax` schema property.

## 3.0.0

- Changed: `getTestRule` signature to only accept options as argument.
- Added: support for Jest 26.0.1+.

## 2.0.0

- Removed: support for stylelint versions less than 13.
- Removed: support for node@8.
- Removed: settings not related to plugin testing.
- Changed: `testRule` signature to only accept `schema` as argument.
- Added: `warnings` to `reject` schema property.
- Added: `plugins` schema property.
- Added: `only` schema property.
- Added: `skip` schema property.
- Fixed: `TypeError: stylelint is not a function`.

## 1.3.0

- Use stylelint exported modules.
- Include `getOsEol.js` in a `.package.json` distribution files.

## 1.2.0

- Use absolute path to `jest-setup.js` in `jest-preset.json`.
- Avoid Jest preset conflicts by not using the Jest preset for this repo.

## 1.1.0

- Include `jest-setup.js` in a .package.json`distribution`files`.

## 1.0.0

- Initial release.
- `jest-setup.js` copied from stylelint upstream [commit](https://github.com/stylelint/stylelint/blob/4c90af5863acf3026d8424b49a78189106f052dc/jest-setup.js).
