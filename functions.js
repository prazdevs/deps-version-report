const fs = require('fs')
const npmFetch = require('npm-registry-fetch')
const R = require('ramda')
const stringify = require('csv-stringify')

const withLatestVersion = async dependency => {
  try {
    const remoteJson = await npmFetch.json(`${dependency[0]}/latest`)
    const latestVersion = remoteJson.version
    return [...dependency, latestVersion]
  } catch (err) {
    console.error(
      '\x1b[33m',
      `WARNING: failed fetching package ${dependency[0]} from npmjs registry.`,
      '\n\tMaybe you are not connected or the package is not available'
    )
    return [...dependency, 'N/A']
  }
}

const withLatestVersions = async dependencies => {
  const completeDeps = dependencies.map(async d => await withLatestVersion(d))
  return Promise.all(completeDeps)
}

const dependenciesWithVersions = R.compose(
  withLatestVersions,
  R.toPairs,
  R.mergeAll,
  R.props(['dependencies', 'devDependencies']),
  JSON.parse,
  fs.readFileSync
)

const writeDependencies = (dependencies, destination) =>
  stringify(dependencies, {
    delimiter: ';',
    columns: ['package', 'current', 'latest'],
    header: true,
  }).pipe(fs.createWriteStream(destination))

module.exports = { dependenciesWithVersions, writeDependencies }
