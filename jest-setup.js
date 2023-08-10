'use strict';

const getTestRule = require('./getTestRule.js');
const getTestRuleConfigs = require('./getTestRuleConfigs.js');

global.testRule = getTestRule();
global.testRuleConfigs = getTestRuleConfigs();
