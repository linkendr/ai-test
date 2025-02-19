const fs = require('fs');

// Read and process the data
const sorted = fs.readFileSync('domains.csv', 'utf-8')
  .split(/",\s*"/) // Split entries while handling spacing
  .map(domain => domain.replace(/^"|"$/g, '')) // Remove surrounding quotes
  .sort((a, b) => a.localeCompare(b)) // Alphabetical sort
  .join('\n'); // Create newline-separated list

fs.writeFileSync('sorted-domains.txt', sorted);
console.log('Successfully sorted and saved to sorted-domains.txt');