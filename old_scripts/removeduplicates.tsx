const fs = require('fs');

// Hardcoded file paths
const inputFile = 'sortedconverteddomains.txt';
const outputFile = 'uniquedomains.txt';

// Regex to handle different newline formats
const newLineRegex = /\r\n|\n\r|\n|\r/g;

// Read and process file
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split(newLineRegex)
  .map(line => line.trim())
  .filter(line => line);

// Remove duplicates
const uniqueLines = [...new Set(lines)];

// Write results
fs.writeFileSync(outputFile, uniqueLines.join('\n'));

console.log(`Removed ${lines.length - uniqueLines.length} duplicates`);
console.log(`Unique domains saved to: ${outputFile}`);
