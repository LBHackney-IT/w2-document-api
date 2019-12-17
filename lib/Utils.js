const fs = require('fs');
const path = require('path');

const Utils = {
  loadSQL(directory) {
    var files = fs.readdirSync(directory);
    return files.reduce((acc, file) => {
      if (file.match(/.*\.sql/)) {
        acc[`${file.replace('.sql', '')}SQL`] = fs.readFileSync(
          path.join(directory, file),
          'utf8'
        );
      }
      return acc;
    }, {});
  }
};

module.exports = Utils;
