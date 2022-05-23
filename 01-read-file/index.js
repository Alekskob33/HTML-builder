const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.resolve(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf-8');
let text = '';

readStream.on('data', chunk => text += chunk);
readStream.on('end', () => stdout.write(text));