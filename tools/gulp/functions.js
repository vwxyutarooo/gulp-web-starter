const fs = require('fs');
const path = require('path');


function getFolders(dir) {
  return fs.readdirSync(dir).filter(function(file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}


exports.getFolders = getFolders;
