const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/elements-demo/runtime-es2015.js',
    './dist/elements-demo/polyfills-es2015.js',
    './dist/elements-demo/scripts.js',
    './dist/elements-demo/main-es2015.js',
  ]
  await fs.ensureDir('elements-demo')
  await concat(files, 'elements-demo/elements.js');
  await fs.copyFile('./dist/elements-demo/styles.css', 'elements-demo/styles.css')
  //await fs.copy('./dist/elements-demo/assets/', 'elements-demo/assets/' )

})()