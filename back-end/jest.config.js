/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    clearMocks: true,
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/server.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};