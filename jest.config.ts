import path from 'path'
import {sync as globbySync} from 'globby'
import {defaults} from 'ts-jest/presets'
import type {InitialOptionsTsJest} from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  transform: {
    ...defaults.transform,
  },
  coveragePathIgnorePatterns: [
    '@roots/filesystem',
    '@roots/bud-typings',
    'types',
    'node_modules',
    'tests',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: globbySync(
    'packages/@roots/*/package.json',
    {absolute: true},
  )
    .map(pkg => {
      const base = path.dirname(pkg)
      const {name} = require(pkg)

      return {
        [`${name}/(.*)$`]: `${base}/src/$1`,
      }
    })
    .reduce((pkgs, pkg) => ({...pkgs, ...pkg}), {}),
  preset: 'ts-jest',
  setupFiles: ['./jest.setup.ts'],
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
    '/docs/',
    '/dev/',
  ],
  verbose: true,
}

export default config
