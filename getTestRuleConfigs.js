'use strict';

const { inspect } = require('node:util');

/** @type {import('.').getTestRuleConfigs} */
module.exports = function getTestRuleConfigs(options = {}) {
	return function testRuleConfigs({
		ruleName,
		accept = [],
		reject = [],
		only = false,
		skip = false,
		plugins = options.plugins,
		loadLint: schemaLoadLint,
	}) {
		if (accept.length === 0 && reject.length === 0) {
			throw new TypeError('The either "accept" or "reject" property must not be empty');
		}

		const loadLint =
			schemaLoadLint || options.loadLint || (() => import('stylelint').then((m) => m.default.lint));

		/** @type {import('stylelint').PublicApi['lint']} */
		let lint;

		beforeAll(async () => {
			lint = await loadLint();
		});

		const testGroup = only ? describe.only : skip ? describe.skip : describe;

		testGroup(`${ruleName} configs`, () => {
			/**
			 * @param {import('.').ConfigCase} case
			 * @param {(warnings: unknown[]) => void} comparison
			 */
			function testConfig({ config, description, only: onlyTest, skip: skipTest }, comparison) {
				const testFn = onlyTest ? test.only : skipTest ? test.skip : test;

				testFn(`${description || inspect(config)}`, async () => {
					const lintConfig = {
						plugins,
						rules: { [ruleName]: config },
					};
					const { results } = await lint({ code: '', config: lintConfig });

					expect(results).toHaveLength(1);
					comparison(results[0].invalidOptionWarnings);
				});
			}

			describe('accept', () => {
				accept.forEach((c) => {
					testConfig(c, (warnings) => {
						// eslint-disable-next-line jest/no-standalone-expect
						expect(warnings).toEqual([]);
					});
				});
			});

			describe('reject', () => {
				reject.forEach((c) => {
					testConfig(c, (warnings) => {
						// eslint-disable-next-line jest/no-standalone-expect
						expect(warnings).toEqual([{ text: expect.stringMatching(`"${ruleName}"`) }]);
					});
				});
			});
		});
	};
};
