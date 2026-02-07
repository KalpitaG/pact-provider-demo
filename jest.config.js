module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  testTimeout: 60000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ]
};
