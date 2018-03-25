"use strict"

const preset = require("../jest-preset.json");
test('it contains expected keys', () => {
  expect(Object.keys(preset)).toMatchSnapshot();
});
