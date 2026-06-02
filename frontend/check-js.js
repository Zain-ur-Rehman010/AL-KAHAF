/**
 * Checks all HTML files for inline JS syntax errors.
 * Run: node check-js.js
 */
const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findHtmlFiles(full, results);
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  let pos = 0;
  let blockIndex = 0;

  while (true) {
    const start = content.indexOf('<script', pos);
    if (start === -1) break;
    const tagEnd = content.indexOf('>', start);
    const end = content.indexOf('</script>', tagEnd);
    if (end === -1) break;
    const tag = content.substring(start, tagEnd + 1);
    pos = end + 9;
    if (tag.includes('src=')) continue; // skip external scripts

    blockIndex++;
    const code = content.substring(tagEnd + 1, end);
    try {
      new Function(code);
    } catch (e) {
      // Find approximate line number in the HTML file
      const htmlLine = content.substring(0, tagEnd + 1).split('\n').length;
      errors.push(`  Block #${blockIndex} (starts ~line ${htmlLine}): ${e.message}`);
    }
  }
  return errors;
}

const htmlFiles = findHtmlFiles(path.join(__dirname, 'src'));
let totalErrors = 0;

for (const file of htmlFiles) {
  const errors = checkFile(file);
  if (errors.length) {
    console.log(`\nERROR: ${path.relative(__dirname, file)}`);
    errors.forEach(e => console.log(e));
    totalErrors += errors.length;
  }
}

if (totalErrors === 0) {
  console.log(`Checked ${htmlFiles.length} files — no JS syntax errors found.`);
} else {
  console.log(`\nFound ${totalErrors} syntax error(s) across ${htmlFiles.length} files.`);
  process.exit(1);
}
