'use strict';

const getTestInvalidRuleConfigs = require('../getTestInvalidRuleConfigs.js');

const testInvalidRuleConfigs = getTestInvalidRuleConfigs();

testInvalidRuleConfigs({
	plugins: [require.resolve('./fixtures/plugin-foo.js')],
	ruleName: 'plugin/foo',

	configs: [
		{
			config: 123,
		},
		{
			config: [/foo/],
			description: 'regex is not allowed',
		},
	],
});
