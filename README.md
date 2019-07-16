## Simple Keychain

A small password storage app with a cli. Performs CRUD operations (plus encryption & decryption). Runs on Mac OS.

---
**Installation**
- Clone this repo.
- Run `npm link` from the root folder.
- Next run `npm link simplekeychain`.
  (For reference, here is the [npm link](https://docs.npmjs.com/cli/link) documentation.)
- Now run `simplekeycahin help`. This will initialize a `data.txt` file in the root folder, and thereon display the app's commands.
- Simple Keycahin is ready to use. To save some keystrokes, don't forget to create your own alias for the app.

**Usage**

The app has 7 commands with which to manage your passwords. Run `simplekeychain help`, or `simplekeychain h`, to
see the commands, their aliases, and the parameters they take.

Here are some examples:
- To add a password to the keychain, run `simplekeychain add` (or `simplekeychain a`) followed by the name of the app whose password you're storing, and then the email account associated with that app, and finally your password wrapped in single quotes. It will look something like this:
`simplekeychain add nameOfApp email@server 'yourPassword'`.
- To retrieve a password you've already stored, run `simplekeychain get` (or `simplekeychain g`) followed by the name of the app whose password you want to retrieve. It will look something like this: `simplekeychain get nameOfApp`.
- To encrypt your passwords, run `simplekeychain encrypt` (or `simplekeychain en`) followed by the single password that you'll use to decrypt when necessary. If you choose to use special characters in your password, remember to wrap it in single quotes. It'll look a bit like this: `simplekeychain encrypt 'your*SimpleKeychainPassword'`. When you encrypt, don't forget or otherwise lose the password you've chosen. It's the one password you'll need to access your others.
- To decrypt your passwords, run `simplekeychain decrypt` (or `simplekeychain d`) followed by your encrypt password. If you used special characters in your encrypt password, you'll need to wrap it in single quotes here too. It'll look something like this: `simplekeychain decrypt 'your*SimpleKeychainPassword'`.
