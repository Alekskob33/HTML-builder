const { mkdir, readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');
const copyDir = require(__dirname + '/copyDir');
const mergeFiles = require(__dirname + '/mergeFiles');

// create dist folder
const dist = path.join(__dirname, 'project-dist');
mkdir(dist, { recursive: true });

// read template
const tplPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');

async function run() {
  buildIndexHtml();
  mergeFiles();
  copyDir('assets', 'project-dist/assets/');
}

async function buildIndexHtml() {
  console.log('build: index.html -> start');

  getComponentsHTML()
    .then((htmlObj) => {
      createHtml(htmlObj)
        .then((html) => {
          writeIndexHtmlFile(html);
        });
    });
  return console.log('build: index.html -> finish');
}

// Получаем данные из файлов html (компонентов)
async function getComponentsHTML() {
  const html = {};
  try {
    const components = await readdir(componentsDir, { withFileTypes: true });
    for (const file of components) {
      if (file.isFile() && path.extname(file.name).slice(1) === 'html') {
        const name = path.parse(file.name).name;
        const layout = await readFile(path.join(componentsDir, file.name), 'utf-8');
        html[name] = layout;
      }
    }
    return html;
  }
  catch (err) {
    console.error(err);
  }
}

async function createHtml(htmlObj) {
  try {
    let tpl = await readFile(tplPath, 'utf-8');
    const regexp = new RegExp('\\{{2}([\\w-])+\\}{2}', 'gi');

    tpl = tpl.replace(regexp, ($1) => {
      const tagname = $1.replace(/[\\{{2}\\}{2}]/g, '');
      if (!htmlObj[tagname]) {
        console.log(`(!) ATTENTION: missed html-template for ${$1}`);
        return $1;
      }
      return htmlObj[tagname];
    });
    return tpl;
  } catch (err) {
    console.log(err.message);
  }
}

async function writeIndexHtmlFile(html) {
  try {
    const indexPath = path.join(dist, 'index.html');
    await writeFile(indexPath, html);
  } catch (err) {
    console.log(err.message);
  }
}

run();
