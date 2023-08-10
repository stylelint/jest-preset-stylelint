'use strict';

const { inspect } = require('util');

/** @type {import('.').getTestInvalidRuleConfigs} */
module.exports = function getTestInvalidRuleConfigs(options = {}) {
	return function testInvalidRuleConfigs({
		ruleName,
		configs,
		only,
		skip,
		plugins = options.plugins,
	}) {
		if (configs.length === 0) {
			throw new TypeError('The "configs" property must not be empty');
		}

		/** @type {import('stylelint').lint} */
		let lint;

		beforeAll(() => {
			// eslint-disable-next-line n/no-unpublished-require
			lint = require('stylelint').lint;
		});

		const testGroup = only ? describe.only : skip ? describe.skip : describe;

		testGroup(`${ruleName} invalid configs`, () => {
			for (const { config, description, only: onlyTest, skip: skipTest } of configs) {
				const testFn = onlyTest ? test.only : skipTest ? test.skip : test;

				/* eslint-disable jest/no-standalone-expect */
				testFn(`${description || inspect(config)}`, async () => {
					const lintConfig = {
						plugins,
						rules: { [ruleName]: config },
					};
					const output = await lint({ code: '', config: lintConfig });

					expect(output.results).toHaveLength(1);
					expect(output.results[0].invalidOptionWarnings).toEqual([
						{ text: expect.stringMatching(`"${ruleName}"`) },
					]);
				});
				/* eslint-enable jest/no-standalone-expect */
			}
		});
	};
};
