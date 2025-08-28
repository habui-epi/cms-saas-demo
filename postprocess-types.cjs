// postprocess-types.js
// This script renames all types/interfaces ending with 'nameArgs' to add a suffix (e.g., _Patched)
// and updates all references in the generated files.

const fs = require('fs');
const path = require('path');


const GENERATED_PATH = path.join(__dirname, 'src', 'generated', 'graphql');
const SUFFIX = '_Patched';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const matches = new Set();
  let match;
  // Find all type/interface declarations ending with 'nameArgs'
  const declPattern = /(export (type|interface) )(\w+nameArgs)\b/g;
  while ((match = declPattern.exec(content)) !== null) {
    matches.add(match[3]);
  }
  // For each match, rename and replace all references
  matches.forEach((typeName) => {
    const newName = typeName + SUFFIX;
    const typeRegex = new RegExp(`\\b${typeName}\\b`, 'g');
    content = content.replace(typeRegex, newName);
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

function processTarget(targetPath) {
  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      // Process all files in the directory (no extension filter)
      const files = fs.readdirSync(targetPath);
      files.forEach(file => {
        const filePath = path.join(targetPath, file);
        if (fs.statSync(filePath).isFile()) {
          processFile(filePath);
        }
      });
    } else if (stat.isFile()) {
      processFile(targetPath);
    } else {
      console.error('Target is neither a file nor a directory:', targetPath);
    }
  } else {
    console.error('Target path does not exist:', targetPath);
  }
}

processTarget(GENERATED_PATH);
console.log('Post-processing complete: renamed all *nameArgs types with suffix', SUFFIX);
