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


exports.getFolders = getFolders;
exports.getFiles = getFiles;
