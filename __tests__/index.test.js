"use strict"

const preset = require("../jest-preset.json");
it('should contain expected keys', () => {
  expect(Object.keys(preset)).toMatchSnapshot();
});
