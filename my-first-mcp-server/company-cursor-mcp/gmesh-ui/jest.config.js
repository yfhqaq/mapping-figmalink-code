module.exports = {
    roots: ['./src'],
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testPathIgnorePatterns: ['node_modules/'],
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    coverageDirectory: './coverage/',
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{ts,tsx,js,jsx}',
        '!**/*.stories.{ts,tsx,js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
};
