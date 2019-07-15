const logo = `
 ______  +                  __
|    __|___ _________ _____|  |____
|__    |   |         |   ! |  |  !_|
|______|___|__|___|__|   __|__|____|
 ___  ___            |__|  __           +
|   |/  / ____ __  ___ ___|  |__ _____ ___ _____
|      < |  !_|  |/  /  __|     | !   |   |     |
|___|\\___\\____|__   /\\____|__|__|___|_|___|__|__|
            |______/\n`;

const showManual = (commandList, programName, programDescription, logo) => {
  let output = ``;
  for (let i = 0; i < commandList.length; i++) {
    for (key in commandList[i]) {
      let alias = commandList[i][key].alias || null;
      let stringArray = commandList[i][key].command.split(' ');

      if (alias) {
        alias = '|' + alias
        stringArray[0] = stringArray[0] + alias;
      }

      output = output + `   ${stringArray.join(' ')}\n   (${commandList[i][key].description})\n\n`
    }
  }

  return `${logo}\nUsage: ${programName} [command]\n\nDescription: ${programDescription}\n\nCommands:\n${output}__________________________________________`;
}

module.exports = { logo, showManual };