export type TestCase = {
	/**
	 * The code of the test case.
	 */
	code: string;

	/**
	 * Description of the test case.
	 */
	description?: string;

	/**
	 * Maps to Jest's `test.only`. Default: `false`.
	 *
	 * @see https://jestjs.io/docs/en/api#testonlyname-fn-timeout
	 */
	only?: boolean;

	/**
	 * Maps to Jest's `test.skip`. Default: `false`.
	 *
	 * @see https://jestjs.io/docs/api#testskipname-fn
	 */
	skip?: boolean;
};

export type AcceptTestCase = TestCase;

export type Warning = {
	/**
	 * Expected message from the test case. Usually exported from the plugin.
	 * Optional if `warnings` is used.
	 */
	message?: string;

	/**
	 * Expected line number of the warning.
	 */
	line?: number;

	/**
	 * Expected column number of the warning.
	 */
	column?: number;

	/**
	 * Expected end line number of the warning.
	 */
	endLine?: number;

	/**
	 * Expected end column number of the warning.
	 */
	endColumn?: number;
};

export type RejectTestCase = TestCase &
	Warning & {
		/**
		 * Expected fixed code of the test case.
		 */
		fixed?: string;

		/**
		 * Don't check the `fixed` code. Default: `false`.
		 */
		unfixable?: boolean;

		/**
		 * Warning objects containing expected `message`, `line` and `column` etc.
		 * Optional if `message` is used.
		 */
		warnings?: Warning[];
	};

export type TestSchema = {
	/**
	 * Name of the rule being tested. Usually exported from the plugin.
	 */
	ruleName: string;

	/**
	 * Config to pass to the rule.
	 */
	config: unknown[];

	/**
	 * Accept test cases.
	 */
	accept?: AcceptTestCase[];

	/**
	 * Reject test cases.
	 */
	reject?: RejectTestCase[];

	/**
	 * Turn on autofix. Default: `false`.
	 */
	fix?: boolean;

	/**
	 * Maps to Stylelint's `plugins` configuration property.
	 *
	 * Path to the file that exports the plugin object, relative to the root.
	 * Usually it's the same path as a `main` property in plugin's `package.json`.
	 *
	 * If you're testing a plugin pack, it's the path to the file that exports the array of plugin objects.
	 * Optional, if `plugins` option was passed to advanced configuration with `getTestRule()`.
	 *
	 * @see https://stylelint.io/user-guide/configure#plugins
	 */
	plugins?: string | string[];

	/**
	 * Maps to Stylelint's `customSyntax` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#customsyntax
	 */
	customSyntax?: string;

	/**
	 * Maps to Stylelint's `codeFilename` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#codefilename
	 */
	codeFilename?: string;

	/**
	 * Maps to Jest's `test.only`. Default: `false`.
	 *
	 * @see https://jestjs.io/docs/en/api#testonlyname-fn-timeout
	 */
	only?: boolean;

	/**
	 * Maps to Jest's `test.skip`. Default: `false`.
	 *
	 * @see https://jestjs.io/docs/api#testskipname-fn
	 */
	skip?: boolean;
};

/**
 * Test a rule with the specified schema.
 */
export declare function testRule(schema: TestSchema): void;

/**
 * Create a `testRule()` function with any specified plugins.
 */
export function getTestRule(options?: { plugins?: TestSchema['plugins'] }): typeof testRule;
