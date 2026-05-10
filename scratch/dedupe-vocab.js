const fs = require('fs');
const FILE = 'vocab.ndjson';
if (!fs.existsSync(FILE)) process.exit(0);
const lines = fs.readFileSync(FILE, 'utf8').split('\n').filter(Boolean);
const seen = new Set();
const uniqueLines = [];
lines.forEach(line => {
    const obj = JSON.parse(line);
    if (!seen.has(obj._id)) {
        seen.add(obj._id);
        uniqueLines.push(line);
    }
});
fs.writeFileSync(FILE, uniqueLines.join('\n') + '\n');
console.log(`Deduplicated: ${lines.length} -> ${uniqueLines.size || uniqueLines.length} lines.`);
