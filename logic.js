const fs = require('fs');
const path = require('path');

let dataFile = path.join(__dirname, 'data.json');

if (!fs.existsSync(dataFile)) {
  let starterObj = {}
  fs.writeFile(dataFile, JSON.stringify(starterObj), function () {
    console.log('data.json file created');
    return;
  });
}

const addPassword = (app, username, email, password) => {
  let rawData = fs.readFileSync(dataFile, 'utf8');
  let parsedData = JSON.parse(rawData);

  parsedData[app] = { username, email, password }

  fs.writeFile(dataFile, JSON.stringify(parsedData), function () {
    console.log('Password added');
    return;
  });

  return;
}

const getPassword = (app) => {
  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (key in data) {
    if (key === app) {
      console.log(`>\n${data[key].password}`);
      return;
    }
  }

  return console.log('No info saved for that app.');
}

const changePassword = (app, newPassword, newUsername, newEmail) => {
  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  if (newPassword === null) { return; }

  for (key in data) {
    if (key === app) {
      data[key].password = newPassword;
      data[key].username = newUsername || data[key].username;
      data[key].email = newEmail || data[key].email;

      fs.writeFile(dataFile, JSON.stringify(data), () => {
        return console.log(`Password for ${app} has been changed.`);
      });
    }
  }

  return;
}

const deleteInfo = (app) => {
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
  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for(key in data) {
    console.log(key);
  }
}

module.exports = { addPassword, getPassword, changePassword, deleteInfo, listApps };