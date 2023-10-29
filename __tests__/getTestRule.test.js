'use strict';

const { getTestRule } = require('../index.js');

const testRule = getTestRule();
const plugins = [require.resolve('./fixtures/plugin-foo.js')];
const ruleName = 'plugin/foo';

testRule({
	plugins,
	ruleName,
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

testRule({
	plugins,
	ruleName,
	config: ['.a'],
	loadLint: () => Promise.resolve(require('stylelint').lint),
	accept: [{ code: '.a {}' }],
});

const testRuleWithLoadLint = getTestRule({
	loadLint: () => Promise.resolve(require('stylelint').lint),
});

testRuleWithLoadLint({
	plugins,
	ruleName,
	config: ['.a'],
	accept: [{ code: '.a {}' }],
});
