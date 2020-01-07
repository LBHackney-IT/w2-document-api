const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);

module.exports = function(config) {
  return {
    getDocument: async function(id) {
      return await readFile(
        path.join(__dirname, `../../test/test-data/images/${id}`)
      );
    }
  };
};
