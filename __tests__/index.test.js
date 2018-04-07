const preset = require("../jest-preset.json");
it('should contain expected keys', () => {
  expect(Object.keys(preset)).toMatchSnapshot();
});

it("should match .js extension files", () => {
  expect(preset.moduleFileExtensions).toEqual([
    "js",
    "json",
    "jsx",
    "node"
  ]);
});
