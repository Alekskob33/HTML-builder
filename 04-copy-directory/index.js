const path = require('path');
const { readdir, mkdir, rm, copyFile } = require('fs/promises');

async function copyDir(srcPath, distPath) {
  console.log('copy: ' + path.parse(srcPath).base + '/');

  srcPath = path.resolve(__dirname, srcPath); // 'files/'
  distPath = path.resolve(__dirname, distPath); // 'files-copy/'

  await rm(distPath, { recursive: true, force: true }); // delete dist
  await mkdir(distPath, { recursive: true }); // init dist

  try {
    const files = await readdir(srcPath, { withFileTypes: true });
    for (let file of files) {
      const src = path.resolve(srcPath, file.name);
      const dist = path.resolve(distPath, file.name);

      if (file.isDirectory()) {
        await copyDir(src, dist); // recursive copy (nested folders)
        continue;
      } else if (file.isFile()) {
        await copyFile(src, dist);
      }
    }
    return true;
  } catch (err) {
    console.log(err);
  }
}

copyDir('files/', 'files-copy/');