// @ts-ignore
import stylelintConfig from 'eslint-config-stylelint';
// @ts-ignore
import stylelintJestConfig from 'eslint-config-stylelint/jest';

export default [
	...stylelintConfig,
	...stylelintJestConfig,
	{
		settings: {
			jest: { version: 27 },
		},
	},
];
