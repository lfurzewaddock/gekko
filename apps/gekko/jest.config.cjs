module.exports = {
  displayName: 'gekko',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/test/**/*.jest.js'],
  collectCoverageFrom: [
    '<rootDir>/core/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/strategies/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/plugins/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/web/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/exchanges/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/*.d.ts',
  ],
};
