const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
//const readline = require('readline');

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

  if (app === undefined || email === undefined || password === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`)
    //console.log('\x1b[1m', 'simplekeychain h');
    return;
  }

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

  if (app === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {
      const pbcopy = require('child_process').spawn('pbcopy');
      let password = data[key].password.toString();
      pbcopy.stdin.write(password);
      pbcopy.stdin.end();
      //console.log(`>\n${data[key].password}`);
      console.log('Password copied to clipboard')
      return;
    }
  }

  return console.log('No info saved for that app.');
}

const showPassword = (app) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  if (app === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {
      console.log(`>\n${data[key].password}`);
      return;
    }
  }

  return console.log('No info saved for that app.');
}

const clearClipboard = () => {
  const pbcopy = require('child_process').spawn('pbcopy');
  pbcopy.stdin.write('');
  pbcopy.stdin.end();
  console.log('Clipboard cleared')
  return;
}

const getUsername = (app) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  if (app === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {
      console.log(`>\n${data[key].email}`);
      return;
    }
  }

  return console.log('No info saved for that app.');
}

const changePassword = (app, newPassword, newEmail) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('you must decrypt your password file first.') }

  if (app === undefined || password === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`)
    return;
  }

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  //if (newPassword === null) { return; }

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

  if (app === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

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

  return;
}

const encrypt = (password) => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('your file is already encrypted. you cannot encrypt doubly.') }

  if (password === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

  let data = fs.readFileSync(dataFile, 'utf8');

  const initVect = crypto.randomBytes(8).toString('hex');

  const key = crypto.createHash('sha256').update(password).digest();

  const cipher = crypto.createCipheriv('aes256', key, initVect);
  let cipherText = cipher.update(data, 'utf8', 'hex');
  cipherText += cipher.final('hex');

  let encryptedFile = initVect + cipherText;

  fs.writeFile(dataFile, encryptedFile, () => console.log(`Password file has been encrypted.`));

  return;
}

const decrypt = (password) => {
  if (password === undefined) {
    console.log(`Missing argument. Use \x1b[1msimplekeychain h\x1b[0m for help.`);
    return;
  }

  let data = fs.readFileSync(dataFile, 'utf8');

  const key = crypto.createHash('sha256').update(password).digest();

  const initVect = data.slice(0, 16);

  let encryptedData = data.slice(16, data.length);

  const decipher = crypto.createDecipheriv('aes256', key, initVect);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');

  try { decrypted += decipher.final('utf8'); }
  catch (err) { return console.log('you may have entered the wrong password.') }

  fs.writeFile(dataFile, decrypted, () => console.log(`Password file has been decrypted.`));

  return;
}

module.exports = {
  addPassword,
  getPassword,
  getUsername,
  showPassword,
  clearClipboard,
  changePassword,
  deleteInfo,
  listApps,
  encrypt,
  decrypt
};