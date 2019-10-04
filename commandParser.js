const { logo, showManual } = require('./sKManual');

var Program = function () {
  this.programName = 'simplekeychain'
  this.programVersion = null;
  this.programDescription = null;

  this.lastMethodsCalled = [];

  this.allCommands = [
    {
      version: {
        command: 'version',
        alias: 'v',
        description: 'Shows version number.',
        action: () => console.log(`v${this.programVersion}`)
      }
    },
    {
      help: {
        command: 'help',
        alias: 'h',
        description: 'Displays this manual.',
        action: () => {
          return console.log(showManual(this.allCommands, this.programName, this.programDescription, logo));
        }
      }
    }
  ]
}

Program.prototype.version = function (v) {
  this.programVersion = v;
  this.lastMethodsCalled.push('version');
  return this;
}

Program.prototype.description = function (descript) {
  let index = this.allCommands.length - 1;

  if (this.lastMethodsCalled.includes('version')) {
    this.programDescription = descript;
    this.lastMethodsCalled.push('description');
  }
  else if (this.lastMethodsCalled.includes('command')) {
    for (key in this.allCommands[index]) {
      this.allCommands[index][key].description = descript;
    }
  }

  return this;
}

Program.prototype.command = function (input) {
  let inputArray = input.split(' ');
  let key = inputArray[0];
  let newCommandInfo = {};

  newCommandInfo[key] = { command: input }

  this.allCommands.push(newCommandInfo);

  this.lastMethodsCalled = [];
  this.lastMethodsCalled.push('command');

  return this;
}

Program.prototype.alias = function (input) {
  let index = this.allCommands.length - 1;

  if (this.lastMethodsCalled.includes('command')) {
    for (key in this.allCommands[index]) {
      this.allCommands[index][key].alias = input;
      //this.allCommands[index][key].alias.push(input);
    }
  }

  return this;
}

Program.prototype.action = function (fn) {
  let index = this.allCommands.length - 1;

  if (this.lastMethodsCalled.includes('command')) {
    for (key in this.allCommands[index]) {
      this.allCommands[index][key].action = fn;
    }
  }

  return this;
}

Program.prototype.parse = function (argv) {
  let command = argv.slice(2)[0];

  for (let i = 0; i < this.allCommands.length; i++) {
    for (key in this.allCommands[i]) {
      if (command === key || this.allCommands[i][key].alias === command) {
        return this.allCommands[i][key].action(...argv.slice(3));
      }
    }
  }

  const badCommandOutput = `\nThat's not a command.\nTo see the help menu, run this: \x1b[1msimplekeychain h\x1b[0m`;
  return console.log(badCommandOutput);
}



module.exports = new Program();

/* EXAMPLE USAGE:

const program = require('./commandParser');
const { addpassword, getPassword } = require('./logic.js'); //import the functions to be used

program
  .version('0.0.1')
  .description('Password keychain');

program
  .command('addPassword <app> <username> <email> <password>')
  .alias('a')
  .description('add password info')
  .action((app, username, email, password) => {
    addPassword(app, username, email, password);
  });

program
  .command('getPassword <app>')
  .alias('g')
  .description('get password info')
  .action(app => getPassword(app));

program.parse(process.argv);

*/