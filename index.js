#!/usr/bin/env node
"use strict";
const fs = require("fs");
const npmFetch = require("npm-registry-fetch");

const packageJsonFile = fs.readFileSync("./package.json");
const packageJson = JSON.parse(packageJsonFile);
const dependencies = packageJson.dependencies;
const devDependencies = packageJson.devDependencies;

const getLatestVersion = async (packageName) => {
  const remoteJson = await npmFetch.json(`${packageName}/latest`);
  return remoteJson.version;
};

const printLatest = (packageName) =>
  getLatestVersion(packageName).then((ver) =>
    console.log(`${packageName} : ${ver}`)
  );

Object.keys(dependencies).forEach(printLatest);
Object.keys(devDependencies).forEach(printLatest);
