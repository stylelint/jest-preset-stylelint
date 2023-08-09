'use strict';

const stylelint = require('stylelint');

const ruleName = 'plugin/foo';

const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: (selector) => `No "${selector}" selector`,
});

/** @type {(value: unknown) => boolean} */
const isString = (value) => typeof value === 'string';

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((rule) => {
			const { selector } = rule;

			if (primary !== selector) {
				stylelint.utils.report({
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

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
