module.exports = {
  rootDir: '.',
  collectCoverage: true,
  passWithNoTests: true,
  collectCoverageFrom: [
    // UI / Exchange style source roots
    'src/**/*.{js,jsx,ts,tsx}',

    // Gekko source roots
    'core/**/*.{js,jsx,ts,tsx}',
    'strategies/**/*.{js,jsx,ts,tsx}',
    'plugins/**/*.{js,jsx,ts,tsx}',
    'web/**/*.{js,jsx,ts,tsx}',
    'exchanges/**/*.{js,jsx,ts,tsx}',

    // Exclusions
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/vendor/**',
    '!web/vue/public/vendor/**',
    // Legacy files with top-level return (not parseable for Babel coverage)
    '!core/talib.js',
    '!core/tulind.js',
  ],
  // Use project-level configs so each workspace package controls its own src coverage.
  projects: [
    '<rootDir>/apps/ui/jest.config.cjs',
    '<rootDir>/apps/gekko/jest.config.cjs',
    '<rootDir>/apps/exchange/jest.config.cjs',
  ],

  coverageProvider: 'babel',
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
};
