'use strict';

const getTestRuleConfigs = require('../getTestRuleConfigs.js');

const testRuleConfigs = getTestRuleConfigs();

testRuleConfigs({
	plugins: [require.resolve('./fixtures/plugin-foo.js')],
	ruleName: 'plugin/foo',

	accept: [
		{
			config: 'a',
		},
		{
			config: ['b'],
			description: 'string is allowed',
		},
	],

	reject: [
		{
			config: 123,
		},
		{
			config: [/foo/],
			description: 'regex is not allowed',
		},
	],
});
