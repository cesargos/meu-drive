/**
 * For a detailed explanation regarding each configuration property, visit:
 */
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  resetMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],  // monta o html de coverage
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
  ],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
  ],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.js",
    "!<rootDir>/src/**/index.js",
  ],  
};
export default config;
