const fs = require('fs');

module.exports = function() {
  return {
    getDocument: async function(id) {
      return await fs.promises.readFile(`api/test/test-data/images/${id}`);
    }
  };
};
