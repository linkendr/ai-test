const fs = require('fs');

const isIPv4 = (domain) => {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(domain);
};

const input = fs.readFileSync('sorted-by-domains.txt', 'utf8');
const domains = input.split('\n').filter(line => line.trim());

const processed = domains.map(domain => {
    const trimmed = domain.trim();
    
    if (isIPv4(trimmed)) {
        return trimmed; // Return IP address unchanged
    }
    
    const parts = trimmed.split('.');
    if (parts.length > 2) {
        return `*.${parts.slice(1).join('.')}`;
    }
    return trimmed;
});

fs.writeFileSync('convertedsubdomains.txt', processed.join('\n'));
console.log('Processing complete! IP addresses preserved.');
