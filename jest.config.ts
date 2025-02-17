import type { JestConfigWithTsJest } from 'ts-jest'
require('dotenv').config({
  path: "tests/.env"
})
const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Or 'jsdom' for frontend tests
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
