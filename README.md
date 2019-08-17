## Simple Keychain

A small password storage app with a cli. Performs CRUD operations (plus encryption). Runs on Mac OS.

---
**Installation**
- Clone this repo.
- Create a memorable alias for the Simple Keychain app in your `.bash_profile`. The app's entry point is `simpleKeychain.js`. Your alias will look something like this: `alias simplekeychain="node [full path]/simpleKeychain/simpleKeychain.js"`. For more information on editing and/or creating a `.bash_profile`, here is a [quick step-by-step tutorial](https://coolestguidesontheplanet.com/make-an-alias-in-bash-shell-in-os-x-terminal/).
- Now run your alias command with the `help` option. In this example, our alias is `simpleKeychain`, so we'll run `simplekeycahin help`. This will create a `data.txt` file in the root folder, and then display instructions for the app's usage. Once the data file is created, it will not be created again, and the `help` option will only display the app's instructions.

**Note**

Your passwords will be stored in the `data.txt` file. They will be secure after the Simple Keychain encryption operation is performed, and they will be exposed after the decryption operation is performed. For added security, you may rename or move the data file. If you do so, you must change the file name and/or path in Simple Keychain's `logic.js` file, on line 5. Renaming your data file requires you to replace `'data.txt'` (on line 5) with somthing like this `'yourNewFileName.txt'`. Moving your data file requires you to replace the code located to the right of the `=` operator (on line 5) with a string that contains the full path to your data file. It will look somthing like this: `let dataFile = '[full path]/data.txt';`. The app will work as intended after that.

**Usage**

The app has 7 options with which to manage your passwords. Run `simplekeychain help`, or `simplekeychain h`, to see the options, their aliases, and the arguments they take.

Here are some examples:
- To add a password to your keychain, use the `add` option (or `a`, which is its alias). This option requires three arguments passed in the following order: 1.) the name of the app whose password you're storing, 2.) the email account or user name associated with that app, and 3.) your password wrapped in single quotes. The full command will look something like this: `simplekeychain add nameOfApp email@server 'yourPassword'`.
- To retrieve a password you've already stored, use the `get` option (or `g`). This option requires one argument: the name of the app whose password you want to retrieve. The full command will look something like this: `simplekeychain get nameOfApp`.
- To encrypt your passwords, use the `encrypt` option (or `en`). You will pass `encrypt` one argument, which will become your Simple Keychain password. This is the single password you'll use to decrypt your other passwords, and it is created freshly each time you encrypt. If you choose to use special characters in your Simple Keychain password, remember to wrap it in single quotes. The full command will look something like this: `simplekeychain encrypt 'your*SimpleKeychainPassword'`. Please, when you encrypt, remember your Simple Keychain password. It is the single password you'll need to access your others.
- To decrypt your passwords, use the `decrypt` option (`d`). You will pass it one argument: your Simple Keychain password. If you used special characters when you created your password, you'll need to wrap it in single quotes. The full command will look something like this: `simplekeychain decrypt 'your*SimpleKeychainPassword'`.
