import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan
const DIRECTORIES = [
  path.join(__dirname, '..', 'src', 'features'),
  path.join(__dirname, '..', 'src', 'components')
];

// File extensions to check
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Enable auto-renaming (set to true to automatically rename files and directories)
// Cambia esto de false a true para habilitar el renombrado automático
const AUTO_RENAME = true;

// Function to check if a string is in PascalCase
function isPascalCase(str) {
  return /^[A-Z][A-Za-z0-9]*$/.test(str);
}

// Function to convert to PascalCase
function toPascalCase(str) {
  return str
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, letter => letter.toUpperCase());
}

// Function to scan directories recursively
function scanDirectory(directory) {
  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.log(`Directory does not exist: ${directory}`);
    return;
  }
  
  console.log(`Scanning directory: ${directory}`);
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      // Check directory name
      if (!isPascalCase(file.name)) {
        console.log(`Directory not in PascalCase: ${fullPath}`);
        if (AUTO_RENAME) {
          const newName = toPascalCase(file.name);
          const newPath = path.join(directory, newName);
          try {
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed to: ${newPath}`);
            // Continue scanning with the new path
            scanDirectory(newPath);
          } catch (error) {
            console.error(`Error renaming directory: ${error.message}`);
            // Continue scanning with the original path
            scanDirectory(fullPath);
          }
        } else {
          scanDirectory(fullPath);
        }
      } else {
        scanDirectory(fullPath);
      }
    } else if (file.isFile() && EXTENSIONS.includes(path.extname(file.name))) {
      // Check file name (excluding extension)
      const baseName = path.basename(file.name, path.extname(file.name));
      if (!isPascalCase(baseName)) {
        console.log(`File not in PascalCase: ${fullPath}`);
        if (AUTO_RENAME) {
          const newName = toPascalCase(baseName) + path.extname(file.name);
          const newPath = path.join(directory, newName);
          try {
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed to: ${newPath}`);
            // Check the renamed file
            checkFileExports(newPath);
          } catch (error) {
            console.error(`Error renaming file: ${error.message}`);
            // Check the original file
            checkFileExports(fullPath);
          }
        } else {
          checkFileExports(fullPath);
        }
      } else {
        checkFileExports(fullPath);
      }
    }
  });
}

// Function to check file exports
function checkFileExports(filePath) {
  if (path.extname(filePath) === '.jsx' || path.extname(filePath) === '.tsx') {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g);
      
      if (exportMatches) {
        exportMatches.forEach(match => {
          const componentName = match.split(/\s+/).pop();
          if (!isPascalCase(componentName) && !componentName.startsWith('use')) {
            console.log(`Component export not in PascalCase: ${componentName} in ${filePath}`);
          }
        });
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error.message}`);
    }
  }
}

// Main execution
console.log('Starting PascalCase enforcement check...');
console.log(`Auto-rename is ${AUTO_RENAME ? 'ENABLED' : 'DISABLED'}`);
console.log('To enable auto-rename, set AUTO_RENAME = true in the script');
console.log('-----------------------------------------------------------');

DIRECTORIES.forEach(scanDirectory);
console.log('PascalCase check completed.');