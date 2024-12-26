'use strict';

const { inspect } = require('node:util');

/**
 * @typedef {import('.').TestCase} TestCase
 * @typedef {import('.').TestSchema} TestSchema
 */

/** @type {import('.').getTestRule} */
module.exports = function getTestRule(options = {}) {
	return function testRule(schema) {
		const loadLint =
			schema.loadLint ||
			options.loadLint ||
			(() => import('stylelint').then((m) => m.default.lint)); // eslint-disable-line n/no-unpublished-import -- Avoid auto-install of `stylelint` peer dependency.

		/** @type {import('stylelint').PublicApi['lint']} */
		let lint;

		beforeAll(async () => {
			lint = await loadLint();
		});

		describe(`${schema.ruleName}`, () => {
			const stylelintConfig = {
				plugins: options.plugins || schema.plugins,
				rules: {
					[schema.ruleName]: schema.config,
				},
			};

			setupTestCases({
				name: 'accept',
				cases: schema.accept,
				schema,
				comparisons: (testCase) => async () => {
					const stylelintOptions = {
						code: testCase.code,
						config: stylelintConfig,
						customSyntax: schema.customSyntax,
						codeFilename: testCase.codeFilename || schema.codeFilename,
					};

					const output = await lint(stylelintOptions);

					expect(output.results[0].warnings).toEqual([]);
					expect(output.results[0].parseErrors).toEqual([]);
					expect(output.results[0].invalidOptionWarnings).toEqual([]);

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
						codeFilename: testCase.codeFilename || schema.codeFilename,
						computeReplacementText: schema.computeReplacementText,
					};

					const outputAfterLint = await lint(stylelintOptions);

					const actualWarnings = [
						...outputAfterLint.results[0].invalidOptionWarnings,
						...outputAfterLint.results[0].warnings,
					];

					expect(outputAfterLint.results[0]).toMatchObject({ parseErrors: [] });
					expect(actualWarnings).toHaveLength(testCase.warnings ? testCase.warnings.length : 1);

					for (const [i, expected] of (testCase.warnings || [testCase]).entries()) {
						// @ts-expect-error -- This is our custom matcher.
						expect(expected).toHaveMessage();

						const expectedWarning = {
							text: expected.message,
							line: expected.line,
							column: expected.column,
							endLine: expected.endLine,
							endColumn: expected.endColumn,
							fix: expected.fix,
						};

						for (const [key, value] of Object.entries(expectedWarning)) {
							if (value === undefined) {
								// @ts-expect-error -- Allow a partial object.
								delete expectedWarning[key];
							}
						}

						expect(actualWarnings[i]).toMatchObject(expectedWarning);
					}

					if (schema.fix) {
						// Check that --fix does change code
						if (!testCase.fixed && testCase.fixed !== '' && !testCase.unfixable) {
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
							fix: testCase.unfixable,
						});

						expect(outputAfterLintOnFixedCode.results[0]).toMatchObject({
							warnings: outputAfterFix.results[0].warnings,
							parseErrors: [],
						});
					}

					if (schema.computeReplacementText) {
						const outputAfterFix = await lint({ ...stylelintOptions });

						expect(outputAfterFix.code).toBeUndefined();
					}
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

					describe(`${inspect(schema.config)}`, () => {
						describe(`${inspect(testCase.code)}`, () => {
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
