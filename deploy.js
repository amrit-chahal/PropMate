const fs = require('fs-extra');
const zipper = require('zip-local');
const jsonFile = require('jsonfile');
const path = require('path');
const ChromeWebStore = require('chrome-webstore-manager');
const { ChromeReaderMode } = require('@material-ui/icons');

const extensionId = process.env.EXTENSION_ID;
const buildPath = path.join(__dirname, 'dist');
console.log(buildPath);

zipper.sync.zip(buildPath).compress().save(path.join(buildPath, 'dist.zip'));
const fileBin = fs.readFileSync(path.join(buildPath, 'dist.zip'));

const chromeWebStore = new ChromeWebStore(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

chromeWebStore.getRefreshToken(process.env.REFRESH_TOKEN).then((data) => {
  const json = JSON.parse(data);
    const acessToken = json.access_token;
    chromeWebStore.updateItem(accessToken, fileBin, process.env.EXTENSION_ID).then((data) => {
        console.log(data)
        chromeWebStore.publishItem(acessToken, process.env.EXTENSION_ID).then((data) => {
            console.log(data)
        })
    })
});

console.log("extension deployed")
