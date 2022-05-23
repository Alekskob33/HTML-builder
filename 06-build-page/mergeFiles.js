const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

const styleFolder = path.join(__dirname, 'styles');
const productFolder = path.join(__dirname, 'project-dist');

async function mergeFiles() {
  console.log('build: css -> start');
  try {
    // all css-files
    const styleFiles = await readdir(styleFolder, { withFileTypes: true });
    // create bundle.css
    const bundlePath = path.join(productFolder, 'style.css');
    await writeFile(bundlePath, '');

    let bundleContent = '';

    // handle each file
    for (const file of styleFiles) {
      // if CSS-file
      if (file.isFile() & path.extname(file.name).slice(1) === 'css') {
        const filePath = path.join(styleFolder, file.name);

        const fileData = await readFile(filePath, 'utf-8');
        if (path.parse(file.name).base === 'footer.css') {
          bundleContent += fileData;
        } else {
          bundleContent = fileData + bundleContent;
        }
      }
    }

    // Insert into bundle.css
    await writeFile(bundlePath, bundleContent);
    return console.log('build: css -> finish');
  } catch (err) {
    console.error(err);
  }
}

module.exports = mergeFiles;