const fs = require('fs');

let envFile = '.env';
if (process.env.ENVFILE && fs.existsSync(process.env.ENVFILE)) {
  envFile = process.env.ENVFILE;
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: envFile,
      allowUndefined: true,
    }],
  ],
};
