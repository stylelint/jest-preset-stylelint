declare var testRule: jestPresetStylelint.testRule;

declare namespace jestPresetStylelint {
	type TestCase = {
		code: string;
		description?: string;
		only?: boolean;
		skip?: boolean;
	};

	type AcceptTestCase = TestCase;

	type Warning = {
		message: string;
		line?: number;
		column?: number;
		endLine?: number;
		endColumn?: number;
	};

	type RejectTestCase = TestCase &
		Warning & {
			fixed?: string;
			unfixable?: boolean;
			warnings?: Warning[];
		};

	type TestSchema = {
		ruleName: string;
		config: any;
		accept?: AcceptTestCase[];
		reject?: RejectTestCase[];
		plugins?: string | string[];
		skipBasicChecks?: boolean;
		fix?: boolean;
		customSyntax?: string | import('postcss').Syntax;
		codeFilename?: string;
		only?: boolean;
		skip?: boolean;
	};

	/**
	 * Test a rule with the specified schema.
	 */
	function testRule(schema: TestSchema): void;
}
