const fs = require('fs');
const tldts = require('tldts');

const inputFile = 'sorted-domains.txt';
const outputFile = 'sorted-by-domains.txt';

// Read and process domains
const domains = fs.readFileSync(inputFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

// Sort domains by their root domain with null handling
const sorted = domains.sort((a, b) => {
    const aInfo = tldts.parse(a);
    const bInfo = tldts.parse(b);
    
    // Handle null domains by using full hostname as fallback
    const aDomain = aInfo.domain || aInfo.hostname || a;
    const bDomain = bInfo.domain || bInfo.hostname || b;

    // Compare domains first, then full original strings
    return aDomain.localeCompare(bDomain) || a.localeCompare(b);
});

// Write sorted results
fs.writeFileSync(outputFile, sorted.join('\n'));
