const fs = require('fs-extra');

const { version } = JSON.parse(fs.readFileSync('./package.json'));
const firefoxManifest = JSON.parse(
  fs.readFileSync('./src/firefox/manifest.json')
);
const chromeManifest = JSON.parse(
  fs.readFileSync('./src/chrome/manifest.json')
);

firefoxManifest.version = version;
chromeManifest.version = version;
fs.writeFileSync(
  './src/firefox/manifest.json',
  JSON.stringify(firefoxManifest)
);
fs.writeFileSync('./src/chrome/manifest.json', JSON.stringify(chromeManifest));
