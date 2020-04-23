'use strict';

const getTestRule = require('./getTestRule');
const stylelint = require('stylelint');

global.testRule = getTestRule(stylelint);
