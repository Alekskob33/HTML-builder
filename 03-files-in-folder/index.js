const { readdir, stat } = require('fs/promises');
const path = require('path');

const rootPath = path.join(__dirname, 'secret-folder');

async function showFiles(folder = rootPath) {
  if (folder !== rootPath) {
    folder = path.join(__dirname, 'secret-folder', folder); // subfolder: abs path
  }

  try {
    const files = await readdir(folder, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        // showFiles(file.name); // subfolders are not used
        continue;
      }
      if (file.isFile()) {
        let size = ((await stat(path.resolve(folder, file.name))).size) / 1000 + 'kb';
        const fileName = path.parse(file.name).name;
        const ext = path.extname(file.name).slice(1);
        console.log(`${fileName} - ${ext} - ${size}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

showFiles();