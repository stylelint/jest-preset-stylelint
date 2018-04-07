"use strict";

const fs = require('fs');

const jestBasePreset = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './.coverage/',
  coverageReporters: [
    'lcov',
    'text-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: [
    "js",
  ],
  setupFiles: [
    '<rootDir>/node_modules/jest-preset-stylelint/jest-setup.js'
  ],
  testEnvironment: "node",
    testMatch: [
    '**/?(*.)(spec|test).js'
  ],
  verbose: true
};

fs.writeFileSync('jest-preset.json', JSON.stringify(jestBasePreset, null, 2) + '\n', 'utf8');
