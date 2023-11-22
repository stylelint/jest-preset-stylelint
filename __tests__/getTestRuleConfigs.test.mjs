import { getTestRuleConfigs } from '../index.js';

import plugin from './fixtures/plugin-foo.mjs';

const testRuleConfigs = getTestRuleConfigs();
const plugins = [plugin];
// @ts-expect-error -- TS2339: Property 'ruleName' does not exist on type 'Plugin'.
const { ruleName } = plugin;

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
	loadLint: () => import('stylelint').then((m) => m.default.lint),
	accept: [{ config: 'a' }],
});

const testRuleConfigsWithLoadLint = getTestRuleConfigs({
	loadLint: () => import('stylelint').then((m) => m.default.lint),
});

testRuleConfigsWithLoadLint({
	plugins,
	ruleName,
	accept: [{ config: 'a' }],
});
