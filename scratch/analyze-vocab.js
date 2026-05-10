const fs = require('fs');
const FILE = 'vocab.ndjson';
if (!fs.existsSync(FILE)) {
    console.log('File not found');
    process.exit(0);
}
const lines = fs.readFileSync(FILE, 'utf8').split('\n').filter(Boolean);
const ids = lines.map(l => JSON.parse(l)._id);
const uniqueIds = new Set(ids);
console.log(`Total lines: ${lines.length}`);
console.log(`Unique IDs: ${uniqueIds.size}`);
console.log(`Duplicates: ${lines.length - uniqueIds.size}`);
