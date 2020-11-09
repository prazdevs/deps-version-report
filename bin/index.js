#!/usr/bin/env node
'use strict'

const fs = require('fs')
const yargs = require('yargs')

const { dependenciesWithVersions, writeDependencies } = require('../functions')

const argv = yargs(process.argv).argv

const path = argv.path || './package.json'
const dest = argv.dest || './deps-report.csv'

if (!fs.existsSync(path)) {
  console.error(
    '\x1b[31m',
    'ERROR: no package.json found in current directory.',
    '\n Only root package.json is supporter atm.'
  )
  process.exit()
}

dependenciesWithVersions('./package.json').then(deps =>
  writeDependencies(deps, dest)
)
