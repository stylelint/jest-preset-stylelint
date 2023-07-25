'use strict';

const os = require('os');

const eolDescriptor = Object.getOwnPropertyDescriptor(os, 'EOL');

if (!eolDescriptor) {
	throw new TypeError('`os` must have an `EOL` property');
}

beforeAll(() => {
	// NOTE: `jest.replaceProperty()` is unavailable for a read-only property.
	Object.defineProperty(os, 'EOL', { ...eolDescriptor, value: '\n' });
});

afterAll(() => {
	Object.defineProperty(os, 'EOL', eolDescriptor);
});
