const fs = require('fs');

module.exports = function() {
  return {
    getDocument: async function(id) {
      return await fs.promises.readFile(`test/test-data/images/${id}`);
    }
  };
};
