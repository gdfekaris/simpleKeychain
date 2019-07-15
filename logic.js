const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let dataFile = path.join(__dirname, 'data.txt');

if (!fs.existsSync(dataFile)) {
  let starterObj = {}
  fs.writeFile(dataFile, JSON.stringify(starterObj), function () {
    console.log('data.json file created');
    return;
  });
}

const addPassword = (app, email, password) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  let rawData = fs.readFileSync(dataFile, 'utf8');
  let parsedData = JSON.parse(rawData);

  parsedData[app] = { email, password }

  fs.writeFile(dataFile, JSON.stringify(parsedData), function () {
    console.log('Password added');
    return;
  });

  return;
}

const getPassword = (app) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {
      console.log(`>\n${data[key].password}`);
      return;
    }
  }

  return console.log('No info saved for that app.');
}

const changePassword = (app, newPassword, newEmail) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  if (newPassword === null) { return; }

  for (key in data) {
    if (key === app) {
      data[key].password = newPassword;
      data[key].email = newEmail || data[key].email;

      fs.writeFile(dataFile, JSON.stringify(data), () => {
        return console.log(`Password for ${app} has been changed.`);
      });
    }
  }

  return;
}

const deleteInfo = (app) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {

      delete data[key];

      fs.writeFile(dataFile, JSON.stringify(data), () => {
        return console.log(`All info for ${app} has been deleted.`);
      });
    }
  }

  return;
}

const listApps = () => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  let arr = []

  for (key in data) { arr.push(key) }

  arr.sort().forEach((key) => console.log(key));
}

const encrypt = (password) => {
  let data = fs.readFileSync(dataFile, 'utf8');

  const initVect = crypto.randomBytes(8).toString('hex');

  const key = crypto.createHash('sha256').update(password).digest();

  const cipher = crypto.createCipheriv('aes256', key, initVect);
  let cipherText = cipher.update(data, 'utf8', 'hex');
  cipherText += cipher.final('hex');

  let encryptedFile = initVect + cipherText;

  fs.writeFile(dataFile, encryptedFile, () => console.log(`Password file has been encrypted.`))

}

const decrypt = (password) => {

  let data = fs.readFileSync(dataFile, 'utf8');

  const key = crypto.createHash('sha256').update(password).digest();

  const initVect = data.slice(0, 16);

  let encryptedData = data.slice(16, data.length);

  const decipher = crypto.createDecipheriv('aes256', key, initVect);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  fs.writeFile(dataFile, decrypted, () => console.log(`Password file has been decrypted.`))

}

module.exports = {
  addPassword,
  getPassword,
  changePassword,
  deleteInfo,
  listApps,
  encrypt,
  decrypt
};