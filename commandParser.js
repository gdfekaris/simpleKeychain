var Program = function () {
  this.programName = 'simplekeychain'
  this.programVersion = null;
  this.programDescription = null;

  this.lastMethodsCalled = [];

  this.mapCommands = function () {
    let output = ``;
    for (let i = 0; i < this.allCommands.length; i++) {
      for (key in this.allCommands[i]) {
        let alias = this.allCommands[i][key].alias || null;
        let stringArray = this.allCommands[i][key].command.split(' ');

        if (alias) {
          alias = '|' + alias
          stringArray[0] = stringArray[0] + alias;
        }

        output = output + `   ${stringArray.join(' ')}\n   (${this.allCommands[i][key].description})\n\n`
      }
    }

    return output;
  }

  this.allCommands = [
    {
      version: {
        command: 'version',
        alias: 'v',
        description: 'shows version number',
        action: () => console.log(`v${this.programVersion}`)
      }
    },
    {
      help: {
        command: 'help',
        alias: 'h',
        description: 'displays this manual',
        action: () => {
          const boilerPlate = `Usage: ${this.programName} [command]\n\nDescription: ${this.programDescription}\n\nCommands:\n${this.mapCommands()}`;
          return console.log(boilerPlate);
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

  const badCommandOutput = `\nThat's not a command. Check out the help menu here:\n`;
  console.log(badCommandOutput);

  return this.allCommands[1].help.action();
}



module.exports = new Program();

/* EXAMPLE USAGE:

const program = require('./commandParser');
const { addpassword, getPassword } = require('./logic.js');

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