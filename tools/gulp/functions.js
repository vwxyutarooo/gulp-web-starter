const fs = require('fs');
const path = require('path');


function getFolders(dir) {
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


function getFiles(dir) {
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isFile();
  });
}


function requireUncached($module) {
  delete require.cache[require.resolve($module)];

  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  return require($module);
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require */
}


exports.getFolders = getFolders;
exports.getFiles = getFiles;
exports.requireUncached = requireUncached;
