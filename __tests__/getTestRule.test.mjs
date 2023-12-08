import { getTestRule } from '../index.js';

import plugin from './fixtures/plugin-foo.mjs';

const testRule = getTestRule();
const plugins = [plugin];
const {
	// @ts-expect-error -- TS2339: Property 'ruleName' does not exist on type 'Plugin'.
	ruleName,
	// @ts-expect-error -- TS2339: Property 'ruleName' does not exist on type 'Plugin'.
	rule: { messages },
} = plugin;

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
			message: messages.rejected('#a'),
		},
		{
			code: '#a {}',
			message: messages.rejected('#a'),
			description: 'with description',
		},
	],
});

testRule({
	plugins,
	ruleName,
	config: ['.a'],
	loadLint: () => import('stylelint').then((m) => m.default.lint),
	accept: [{ code: '.a {}' }],
});

const testRuleWithLoadLint = getTestRule({
	loadLint: () => import('stylelint').then((m) => m.default.lint),
});

testRuleWithLoadLint({
	plugins,
	ruleName,
	config: ['.a'],
	accept: [{ code: '.a {}' }],
});
