import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'
import tanstackQuery from '@tanstack/eslint-plugin-query'

export default defineConfig([
  globalIgnores([
    '.now/*',
    '**/*.css',
    '**/.changeset',
    '**/dist',
    'esm/*',
    'public/*',
    'tests/*',
    'scripts/*',
    '**/*.config.js',
    '**/.DS_Store',
    '**/node_modules',
    '**/coverage',
    '**/.next',
    '**/build',
    '!**/.commitlintrc.cjs',
    '!**/.lintstagedrc.cjs',
    '!**/jest.config.js',
    '!**/plopfile.js',
    '!**/react-shim.js',
    '!**/tsup.config.ts',
  ]),
  ...nextCoreWebVitals,
  ...tanstackQuery.configs['flat/recommended'],
  prettier,
])
