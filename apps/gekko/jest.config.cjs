const path = require('path')

module.exports = {
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/test/**/*.jest.js'],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
}