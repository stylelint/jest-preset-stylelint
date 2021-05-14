# Changelog

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
