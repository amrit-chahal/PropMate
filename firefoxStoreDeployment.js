require('dotenv').config();
const zipper = require('zip-local');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs-extra');

const issuedAt = Math.floor(Date.now() / 1000);
const payload = {
  iss: process.env.FIREFOX_JWT_ISSUER,
  jti: Math.random().toString(),
  iat: issuedAt,
  exp: issuedAt + 180
};
console.log(Math.random().toString());

const jwtSecret = process.env.FIREFOX_JWT_SECRET;
const jwtSignedToken = jwt.sign(payload, jwtSecret, {
  algorithm: 'HS256'
});

zipper.sync.zip('./dist-firefox').compress().save('dist-firefox.zip');

const body = new FormData();
body.append('upload', fs.createReadStream('./dist-firefox.zip'));
body.append('channel', 'listed');

let uploadUuid = '';
let isExtensionValid = false;
let retry = 0;

async function uploadResponse() {
  await fetch('https://addons.mozilla.org/api/v5/addons/upload/', {
    headers: {
      Authorization: `JWT ${jwtSignedToken}`
    },
    body,
    method: 'POST'
  })
    .then((response) =>
      response.text().then((data) => (uploadUuid = data.uuid))
    )
    .catch((err) => {
      throw new Error(err);
    });
}
uploadResponse();

async function checkValidStatus() {
  await fetch(
    `https://addons.mozilla.org/api/v5/addons/upload/${uploadUuid}/`,
    {
      headers: {
        Authorization: `JWT ${jwtSignedToken}`
      },
      method: 'GET'
    }
  ).then((response) =>
    response.text().then((data) => (isExtensionValid = data.valid))
  );
}
function extensionValidation() {
  return new Promise((resolve) => setTimeout(resolve, 60000));
}

async function submitExtension() {
  await fetch(
    `https://addons.mozilla.org/api/v5/addons/addon/${process.env.FIREFOX_EXTENSION_UUID}/versions`,
    {
      headers: {
        Authorization: `JWT ${jwtSignedToken}`,
        'Content-Type': 'application/json'
      },
      body: '{"upload": "d367887eee764ef29004a0edee6bbe24"}'
    }
  );
}

async function submitExtensionAfterItsValidatedwhile() {
  while (isExtensionValid === false && retry < 9) {
    await extensionValidation();
    await checkValidStatus();
    retry++;
  }
  if (isExtensionValid) {
    await submitExtension();
  } else {
    throw new Error('request timed out');
  }
}
submitExtensionAfterItsValidatedwhile();



