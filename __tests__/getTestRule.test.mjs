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

testRule({
	plugins,
	ruleName,
	codeFilename: 'foo.css',
	config: ['.a', { filename: 'foo.css' }],
	accept: [{ code: '.a {}' }, { code: '.a {}', codeFilename: 'foo.css' }],
	reject: [
		{
			code: '.a {}',
			codeFilename: 'bar.css',
			message: messages.expectFilename('foo.css', 'bar.css'),
		},
	],
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

testRule({
	plugins,
	ruleName,
	config: ['.a'],
	computeEditInfo: true,

	accept: [],

	reject: [
		{
			code: '#a {}',
			message: messages.rejected('#a'),
			fix: {
				range: [0, 1],
				text: '.',
			},
		},
		{
			code: '.a {} #a {}',
			message: messages.rejected('#a'),
			description: 'with description',
			fix: {
				range: [6, 7],
				text: '.',
			},
		},
		{
			code: '#a, #a {}',
			warnings: [
				{
					message: messages.rejected('#a'),
					fix: {
						range: [0, 1],
						text: '.',
					},
				},
				{
					message: messages.rejected('#a'),
				},
			],
		},
	],
});

testRule({
	plugins,
	ruleName,
	config: ['.a'],
	fix: true,
	computeEditInfo: true,

	accept: [],

	reject: [
		{
			code: '#a {}',
			fixed: '.a {}',
			message: messages.rejected('#a'),
			fix: {
				range: [0, 1],
				text: '.',
			},
		},
		{
			code: '.a {} #a {}',
			fixed: '.a {} .a {}',
			message: messages.rejected('#a'),
			description: 'with description',
			fix: {
				range: [6, 7],
				text: '.',
			},
		},
	],
});

testRule({
	ruleName: 'at-rule-descriptor-no-unknown',
	config: true,
	languageOptions: {
		syntax: {
			atRules: {
				foo: {
					descriptors: {
						bar: '<number>',
					},
				},
			},
		},
	},

	accept: [
		{
			code: '@foo { bar: 1; }',
		},
	],

	reject: [
		{
			code: '@foo { baz: 1; }',
			message:
				'Unexpected unknown descriptor "baz" for at-rule "@foo" (at-rule-descriptor-no-unknown)',
		},
	],
});
