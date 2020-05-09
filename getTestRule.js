'use strict';

const util = require('util');
const { basicChecks, lint } = require('stylelint');

function getTestRule(options = {}) {
	return function testRule(schema) {
		describe(`${schema.ruleName}`, () => {
			const stylelintConfig = {
				plugins: options.plugins || schema.plugins,
				rules: {
					[schema.ruleName]: schema.config,
				},
			};

			let passingTestCases = schema.accept || [];

			if (!schema.skipBasicChecks) {
				passingTestCases = passingTestCases.concat(basicChecks);
			}

			setupTestCases({
				name: 'accept',
				cases: passingTestCases,
				schema,
				comparisons: (testCase) => async () => {
					const options = {
						code: testCase.code,
						config: stylelintConfig,
						syntax: schema.syntax,
					};

					const output = await lint(options);

					expect(output.results[0].warnings).toEqual([]);
					expect(output.results[0].parseErrors).toEqual([]);

					if (!schema.fix) return;

					// Check that --fix doesn't change code
					const outputAfterFix = await lint({ ...options, fix: true });
					const fixedCode = getOutputCss(outputAfterFix);

					expect(fixedCode).toBe(testCase.code);
				},
			});

			setupTestCases({
				name: 'reject',
				cases: schema.reject,
				schema,
				comparisons: (testCase) => async () => {
					const options = {
						code: testCase.code,
						config: stylelintConfig,
						syntax: schema.syntax,
					};

					const outputAfterLint = await lint(options);

					const actualWarnings = outputAfterLint.results[0].warnings;

					expect(outputAfterLint.results[0].parseErrors).toEqual([]);
					expect(actualWarnings).toHaveLength(testCase.warnings ? testCase.warnings.length : 1);

					(testCase.warnings || [testCase]).forEach((expected, i) => {
						const warning = actualWarnings[i];

						expect(expected).toHaveMessage();

						expect(warning.text).toBe(expected.message);

						if (expected.line !== undefined) {
							expect(warning.line).toBe(expected.line);
						}

						if (expected.column !== undefined) {
							expect(warning.column).toBe(expected.column);
						}
					});

					if (!schema.fix) return;

					// Check that --fix doesn't change code
					if (schema.fix && !testCase.fixed && testCase.fixed !== '' && !testCase.unfixable) {
						throw new Error(
							'If using { fix: true } in test schema, all reject cases must have { fixed: .. }',
						);
					}

					const outputAfterFix = await lint({ ...options, fix: true });

					const fixedCode = getOutputCss(outputAfterFix);

					if (!testCase.unfixable) {
						expect(fixedCode).toBe(testCase.fixed);
						expect(fixedCode).not.toBe(testCase.code);
					} else {
						// can't fix
						if (testCase.fixed) {
							expect(fixedCode).toBe(testCase.fixed);
						}

						expect(fixedCode).toBe(testCase.code);
					}

					// Checks whether only errors other than those fixed are reported
					const outputAfterLintOnFixedCode = await lint({
						...options,
						code: fixedCode,
					});

					expect(outputAfterLintOnFixedCode.results[0].warnings).toEqual(
						outputAfterFix.results[0].warnings,
					);
					expect(outputAfterLintOnFixedCode.results[0].parseErrors).toEqual([]);
				},
			});
		});

		expect.extend({
			toHaveMessage(testCase) {
				if (testCase.message === undefined) {
					return {
						message: () => 'Expected "reject" test case to have a "message" property',
						pass: false,
					};
				}

				return {
					pass: true,
				};
			},
		});
	};
}

function setupTestCases({ name, cases, schema, comparisons }) {
	if (cases && cases.length) {
		describe(name, () => {
			cases.forEach((testCase) => {
				if (testCase) {
					const spec = testCase.only ? it.only : testCase.skip ? it.skip : it;

					describe(`${util.inspect(schema.config)}`, () => {
						describe(`${util.inspect(testCase.code)}`, () => {
							spec(testCase.description || 'no description', comparisons(testCase));
						});
					});
				}
			});
		});
	}
}

function getOutputCss(output) {
	const result = output.results[0]._postcssResult;
	const css = result.root.toString(result.opts.syntax);

	return css;
}

module.exports = getTestRule;
