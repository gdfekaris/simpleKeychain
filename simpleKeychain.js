#!/usr/bin/env node

const program = require('./commandParser');
const {
  addPassword,
  getPassword,
  changePassword,
  deleteInfo,
  listApps,
  encrypt,
  decrypt
} = require('./logic');

program
  .version('0.0.1')
  .description('Password keychain');

program
  .command('get <appname>')
  .description('gets password for given app')
  .alias('g')
  .action((appName) => getPassword(appName));

program
  .command(`add <appname> <email> <'password' (must be wrapped in single quotes)>`)
  .description('adds password to keychain')
  .alias('a')
  .action((appname, email, password) => addPassword(appname, email, password));

program
  .command('change <appname> <newpassword> <newusername (optional)> <newemail (optional)>')
  .description('updates password and account info for given app')
  .alias('ch')
  .action((appname, newpassword, newusername, newemail) => changePassword(appname, newpassword, newusername, newemail));

program
  .command('encrypt <key>')
  .description('encrypts password file')
  .alias('en')
  .action((key) => encrypt(key));

program
  .command('decrypt <key>')
  .description('decrypts password file')
  .alias('d')
  .action((key) => decrypt(key));

program
  .command('list')
  .description('lists all apps with stored passwords')
  .alias('l')
  .action(() => listApps());

program
  .command('deleteInfo <appname>')
  .description('deletes all account info for given app')
  .action((appname) => deleteInfo(appname));

program.parse(process.argv);
