const fs = require('fs');
const path = require('path');
const { stdin } = process;

const filename = path.join(__dirname, 'text.txt');

// initalize Text.txt
fs.writeFile(filename, '', (error) => {
  if (error) return console.log(error.message);
  console.log('• Text file has been initialized!');
  console.log('• Enter "exit" to finish the process.');
  console.log('• Start your typing bellow :)');
});

stdin.on('data', (data) => {
  let content = '';
  let input = data.toString();
  if (input.trim() === 'exit') {
    process.exit();
  }

  fs.readFile(filename, (error, data) => {
    if (error) return console.log(error.message);
    content = data.toString();

    content += input;
    fs.writeFile(filename, content, (error) => {
      if (error) return console.log(error.message);
    });
  });
});

// before Exit
process.on('exit', () => {
  console.log('Bye! See you later!');
});