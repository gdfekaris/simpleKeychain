const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

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

const keyEncryption = () => {
  try { JSON.parse(fs.readFileSync(dataFile, 'utf8')) }
  catch (err) { return console.log('\nyour file is already encrypted. you cannot encrypt doubly.') }

  const encrypt = (password) => {
    let data = fs.readFileSync(dataFile, 'utf8');

    const initVect = crypto.randomBytes(8).toString('hex');

    const key = crypto.createHash('sha256').update(password).digest();

    const cipher = crypto.createCipheriv('aes256', key, initVect);
    let cipherText = cipher.update(data, 'utf8', 'hex');
    cipherText += cipher.final('hex');

    let encryptedFile = initVect + cipherText;

    fs.writeFile(dataFile, encryptedFile, () => console.log(`\nPassword file has been encrypted.`));

    return;
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.stdoutMuted = true;

  rl.query = "Enter key: ";
  rl.question(rl.query, function (password) {
    //console.log('\nPassword is ' + password);
    if (password === undefined || password.length === 0) {
      rl.close(console.log(`\nInvalid key. Use \x1b[1msimplekeychain h\x1b[0m for help.`));
      return;
    }
    rl.close(encrypt(password));
  });

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
      if (rl.line.length === 0) {
        rl.output.write(rl.query)
      } else {
        rl.output.write("\x1B[2K\x1B[200D" + rl.query + "[" + ((rl.line.length % 2 == 1) ? "=-" : "-=") + "]");
      }
    } else {
      rl.output.write(stringToWrite);
    }
  };

  return;
}

const keyDecryption = () => {
  const decrypt = (password) => {
    let data = fs.readFileSync(dataFile, 'utf8');

    const key = crypto.createHash('sha256').update(password).digest();

    const initVect = data.slice(0, 16);

    let encryptedData = data.slice(16, data.length);

    const decipher = crypto.createDecipheriv('aes256', key, initVect);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');

    try { decrypted += decipher.final('utf8'); }
    catch (err) { return console.log('\nyou have entered the wrong key.') }

    fs.writeFile(dataFile, decrypted, () => console.log(`\nPassword file has been decrypted.`));

    return;
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.stdoutMuted = true;

  rl.query = "Enter key: ";
  rl.question(rl.query, function (password) {
    //console.log('\nPassword is ' + password);
    if (password === undefined || password.length === 0) {
      rl.close(console.log(`\nInvalid key. Use \x1b[1msimplekeychain h\x1b[0m for help.`));
      return;
    }
    rl.close(decrypt(password));
  });

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
      if (rl.line.length === 0) {
        rl.output.write(rl.query)
      } else {
        rl.output.write("\x1B[2K\x1B[200D" + rl.query + "[" + ((rl.line.length % 2 == 1) ? "=-" : "-=") + "]");
      }
    } else {
      rl.output.write(stringToWrite);
    }
  };

  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });

  // rl.stdoutMuted = true;

  // rl.question('Enter key: ', function (password) {
  //   //console.log('\nPassword is ' + password);
  //   if (password === undefined || password.length === 0) {
  //     rl.close(console.log(`\nInvalid input. Use \x1b[1msimplekeychain h\x1b[0m for help.`));
  //     return;
  //   }
  //   rl.close(decrypt(password));
  // });

  // rl._writeToOutput = function _writeToOutput(stringToWrite) {
  //   if (rl.stdoutMuted)
  //     rl.output.write("*");
  //   else
  //     rl.output.write(stringToWrite);
  // };

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
  keyEncryption,
  keyDecryption
};


