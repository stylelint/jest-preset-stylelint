'use strict';

const getTestRule = require('./getTestRule.js');
const getTestInvalidRuleConfigs = require('./getTestInvalidRuleConfigs.js');

global.testRule = getTestRule();
global.testInvalidRuleConfigs = getTestInvalidRuleConfigs();
