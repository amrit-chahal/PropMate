const fs = require('fs-extra');

const { version } = JSON.parse(fs.readFileSync('./package.json'));
const manifest = JSON.parse(fs.readFileSync('./src/static/manifest.json'));
manifest.version = version;
fs.writeFileSync('./src/static/manifest.json', JSON.stringify(manifest));
