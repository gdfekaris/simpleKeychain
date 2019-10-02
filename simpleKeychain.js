#!/usr/bin/env node

const program = require('./commandParser');
const {
  addPassword,
  getPassword,
  getUsername,
  showPassword,
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
  .description('Gets password for given app.')
  .alias('g')
  .action((appName) => getPassword(appName));

program
  .command('getUsername <appname>')
  .description('Gets username for given app.')
  .alias('gu')
  .action((appname) => getUsername(appname));

program
  .command(`add <appname> <email/username> <'password' (must be wrapped in single quotes)>`)
  .description('Adds password to keychain.')
  .alias('a')
  .action((appname, email, password) => addPassword(appname, email, password));

program
  .command(`show <appname>`)
  .description('Shows password. Be careful.')
  .alias('sh')
  .action((appname) => showPassword(appname));

program
  .command('change <appname> <newpassword> <newemail/username (optional)>')
  .description('Updates password and account info for given app.')
  .alias('ch')
  .action((appname, newpassword, newemail) => changePassword(appname, newpassword, newemail));

program
  .command('encrypt <key>')
  .description('Encrypts password file. If key uses special characters, wrap it in quotes.')
  .alias('en')
  .action((key) => encrypt(key));

program
  .command('decrypt <key>')
  .description('Decrypts password file. If key uses special characters, wrap it in quotes.')
  .alias('d')
  .action((key) => decrypt(key));

program
  .command('list')
  .description('Lists all apps with stored passwords.')
  .alias('l')
  .action(() => listApps());

program
  .command('deleteInfo <appname>')
  .description('Deletes all account info for given app.')
  .action((appname) => deleteInfo(appname));

program.parse(process.argv);
