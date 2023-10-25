'use strict';

const { getTestRuleConfigs } = require('../index.js');

const testRuleConfigs = getTestRuleConfigs();
const plugins = [require.resolve('./fixtures/plugin-foo.js')];
const ruleName = 'plugin/foo';

testRuleConfigs({
	plugins,
	ruleName,

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

testRuleConfigs({
	plugins,
	ruleName,
	loadLint: () => Promise.resolve(require('stylelint').lint),
	accept: [{ config: 'a' }],
});

const testRuleConfigsWithLoadLint = getTestRuleConfigs({
	loadLint: () => Promise.resolve(require('stylelint').lint),
});

testRuleConfigsWithLoadLint({
	plugins,
	ruleName,
	accept: [{ config: 'a' }],
});
