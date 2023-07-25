'use strict';

module.exports = {
	setupFiles: [require.resolve('./jest-setup.js')],
	setupFilesAfterEnv: [require.resolve('./jest-setup-after-env.js')],
	testEnvironment: 'node',
};
