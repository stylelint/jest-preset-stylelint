'use strict';

const util = require('util');
// eslint-disable-next-line node/no-unpublished-require -- Avoid auto-install of `stylelint` peer dependency.
const { lint } = require('stylelint');

const basicChecks = require('./basicChecks');

/**
 * @typedef {jestPresetStylelint.TestCase} TestCase
 * @typedef {jestPresetStylelint.AcceptTestCase} AcceptTestCase
 * @typedef {jestPresetStylelint.RejectTestCase} RejectTestCase
 * @typedef {jestPresetStylelint.TestSchema} TestSchema
 */

/**
 * @param {{
 *   plugins?: TestSchema['plugins'],
 * }} [options]
 * @returns {typeof jestPresetStylelint.testRule}
 */
module.exports = function getTestRule(options = {}) {
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
					const stylelintOptions = {
						code: testCase.code,
						config: stylelintConfig,
						customSyntax: schema.customSyntax,
						codeFilename: schema.codeFilename,
					};

					const output = await lint(stylelintOptions);

					expect(output.results[0].warnings).toEqual([]);
					expect(output.results[0].parseErrors).toEqual([]);

					if (!schema.fix) return;

					// Check that --fix doesn't change code
					const outputAfterFix = await lint({ ...stylelintOptions, fix: true });
					const fixedCode = getOutputCss(outputAfterFix);

					expect(fixedCode).toBe(testCase.code);
				},
			});

			setupTestCases({
				name: 'reject',
				cases: schema.reject,
				schema,
				comparisons: (testCase) => async () => {
					const stylelintOptions = {
						code: testCase.code,
						config: stylelintConfig,
						customSyntax: schema.customSyntax,
						codeFilename: schema.codeFilename,
					};

					const outputAfterLint = await lint(stylelintOptions);

					const actualWarnings = outputAfterLint.results[0].warnings;

					expect(outputAfterLint.results[0].parseErrors).toEqual([]);
					expect(actualWarnings).toHaveLength(testCase.warnings ? testCase.warnings.length : 1);

					(testCase.warnings || [testCase]).forEach((expected, i) => {
						const warning = actualWarnings[i];

						// @ts-expect-error -- This is our custom matcher.
						expect(expected).toHaveMessage();

						expect(warning.text).toBe(expected.message);

						if (expected.line !== undefined) {
							expect(warning.line).toBe(expected.line);
						}

						if (expected.column !== undefined) {
							expect(warning.column).toBe(expected.column);
						}

						if (expected.endLine !== undefined) {
							// @ts-expect-error -- TODO: `warning.endLine` is not implemented. See stylelint/stylelint#5725
							expect(warning.endLine).toBe(expected.endLine);
						}

						if (expected.endColumn !== undefined) {
							// @ts-expect-error -- TODO: `warning.endColumn` is not implemented. See stylelint/stylelint#5725
							expect(warning.endColumn).toBe(expected.endColumn);
						}
					});

					if (!schema.fix) return;

					// Check that --fix doesn't change code
					if (schema.fix && !testCase.fixed && testCase.fixed !== '' && !testCase.unfixable) {
						throw new Error(
							'If using { fix: true } in test schema, all reject cases must have { fixed: .. }',
						);
					}

					const outputAfterFix = await lint({ ...stylelintOptions, fix: true });

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
						...stylelintOptions,
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
					message: () => '',
					pass: true,
				};
			},
		});
	};
};

/**
 * @template {TestCase} T
 * @param {{
 *   name: string,
 *   cases: T[] | undefined,
 *   schema: TestSchema,
 *   comparisons: (testCase: T) => jest.ProvidesCallback,
 * }} args
 * @returns {void}
 */
function setupTestCases({ name, cases, schema, comparisons }) {
	if (cases && cases.length) {
		const testGroup = schema.only ? describe.only : schema.skip ? describe.skip : describe;

		testGroup(`${name}`, () => {
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

/**
 * @param {import('stylelint').LinterResult} output
 * @returns {string}
 */
function getOutputCss(output) {
	const result = output.results[0]._postcssResult;

	if (result && result.root && result.opts) {
		return result.root.toString(result.opts.syntax);
	}

	throw new TypeError('Invalid result');
}
