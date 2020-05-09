'use strict';

// Mock should be before stylelint required. Even if it's required inside other modules
jest.mock('stylelint/lib/utils/getOsEol', () => () => '\n');

const getTestRule = require('./getTestRule');

global.testRule = getTestRule();
