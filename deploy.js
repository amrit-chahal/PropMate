require('dotenv').config();
const fs = require('fs-extra');
const zipper = require('zip-local');
const jsonFile = require('jsonfile');
const path = require('path');
const ChromeWebStore = require('chrome-webstore-manager');

const extensionId = process.env.EXTENSION_ID;

zipper.sync.zip('./dist').compress().save('dist.zip');

console.log('after zip');
const fileBin = fs.readFileSync(path.resolve('./dist.zip'));
console.log(fileBin)

const chromeWebStore = new ChromeWebStore(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

console.log(chromeWebStore);

try {
  chromeWebStore
    .getRefreshToken(process.env.REFRESH_TOKEN)
    .then(function (data) {
      const accessToken = data.access_token;
      console.log(accessToken);
      chromeWebStore
        .updateItem(accessToken, fileBin, process.env.EXTENSION_ID)
        .then((data) => {
          console.log(data);
          chromeWebStore
            .publishItem(accessToken, process.env.EXTENSION_ID)
            .then((data) => {
              console.log(data);
              console.log('extension deployed');
            });
        })
        .catch((err) => console.log(err));
    });
} catch (error) {
  console.log(error);
}
