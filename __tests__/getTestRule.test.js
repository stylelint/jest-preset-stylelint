'use strict';

const getTestRule = require('../getTestRule.js');

const testRule = getTestRule();

testRule({
	plugins: [require.resolve('./fixtures/plugin-foo.js')],
	ruleName: 'plugin/foo',
	config: ['.a'],
	invalidConfig: [123],

	accept: [
		{
			code: '.a {}',
		},
	],

	reject: [
		{
			code: '#a {}',
			message: 'No "#a" selector (plugin/foo)',
		},
	],
});
