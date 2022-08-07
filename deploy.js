const fs = require('fs-extra');
const zipper = require('zip-local');
const jsonFile = require('jsonfile');
const path = require('path');
const chromeWebStore = require('chrome-webstore-manager');

const extensionId = process.env.EXTENSION_ID;
const buildPath = path.join(__dirname, "dist");
console.log(buildPath);
