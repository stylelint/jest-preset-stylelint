'use strict';

const preset = require('../jest-preset.js');

it('should contain expected keys', () => {
	expect(Object.keys(preset)).toMatchSnapshot();
});
