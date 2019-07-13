#!/usr/bin/env node

const program = require('./commandParser');
const { addPassword, getPassword, changePassword, deleteInfo, listApps } = require('./logic');

program
  .version('0.0.1')
  .description('Password keychain');

program
  .command('getPassword <appname>')
  .description('gets password for given app')
  .alias('g')
  .action((appName) => getPassword(appName));

program
  .command('addPassword <appname> <username> <email> <password>')
  .description('adds password to keychain')
  .alias('a')
  .action((appname, username, email, password) => addPassword(appname, username, email, password));

program
  .command('changePassword <appname> <newpassword> <newusername (optional)> <newemail (optional)>')
  .description('updates password and account info for given app')
  .alias('ch')
  .action((appname, newpassword, newusername, newemail) => changePassword(appname, newpassword, newusername, newemail));

program
  .command('deleteInfo <appname>')
  .description('deletes all account info for given app')
  .action((appname) => deleteInfo(appname));

program
  .command('listApps')
  .description('lists all apps with stored passwords')
  .alias('list')
  .action(() => listApps());

program.parse(process.argv);
