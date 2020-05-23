const fs = require('fs');
const path = require('path');

async function getAll() {
  return JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'data', 'Users.json'), {
      encoding: 'utf8'
    })
  );
}

async function writeAll(users) {
  await fs.promises.writeFile(path.join(__dirname, 'data', 'Users.json'), JSON.stringify(users));
}

module.exports.getAll = getAll;
module.exports.writeAll = writeAll;