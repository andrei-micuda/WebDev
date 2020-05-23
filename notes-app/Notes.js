const fs = require('fs');
const path = require('path');

async function getAll() {
  return JSON.parse(
    await fs.promises.readFile(path.join(__dirname, 'data', 'Notes.json'), {
      encoding: 'utf8'
    })
  );
}

async function writeAll(notes) {
  await fs.promises.writeFile(path.join(__dirname, 'data', 'Notes.json'), JSON.stringify(notes));
}

module.exports.getAll = getAll;
module.exports.writeAll = writeAll;