'use strict';

const getTestRule = require('../getTestRule.js');

const testRule = getTestRule();

testRule({
	plugins: [require.resolve('./fixtures/plugin-foo.js')],
	ruleName: 'plugin/foo',
	config: ['.a'],

	accept: [
		{
			code: '.a {}',
		},
		{
			code: '.a {}',
			description: 'with description',
		},
	],

	reject: [
		{
			code: '#a {}',
			message: 'No "#a" selector (plugin/foo)',
		},
		{
			code: '#a {}',
			message: 'No "#a" selector (plugin/foo)',
			description: 'with description',
		},
	],
});
