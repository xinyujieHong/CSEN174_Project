module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/utils'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'utils/**/*.ts',
    '!utils/**/*.test.ts',
    '!utils/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
