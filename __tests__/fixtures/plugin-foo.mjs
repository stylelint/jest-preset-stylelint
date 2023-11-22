import stylelint from 'stylelint';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/foo';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `No "${selector}" selector`,
});

/** @type {(value: unknown) => boolean} */
const isString = (value) => typeof value === 'string';

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((rule) => {
			const { selector } = rule;

			if (primary !== selector) {
				report({
					result,
					ruleName,
					message: messages.rejected(selector),
					node: rule,
				});
			}
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
