/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    clearMocks: true,
    globalSetup: './.env.jest.js',
}
export default config
