const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../music');
const files = fs.readdirSync(directoryPath);
const exportFile = path.join(directoryPath, 'index.ts');

let exportsContent = '';

files.forEach((file) => {
  if (path.extname(file) === '.json') {
    const baseName = path.basename(file, '.json');
    exportsContent += `export { default as ${baseName} } from './${file}';\n`;
  }
});

fs.writeFileSync(exportFile, exportsContent);
console.log('index built!');
console.log('\x1b[36m%s\x1b[0m', 'I am cyan');
console.log('index built!');