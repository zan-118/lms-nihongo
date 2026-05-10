const fs = require('fs');
const readline = require('readline');

async function cleanVocab() {
  const inputPath = 'vocab.ndjson';
  const outputPath = 'vocab.cleaned.ndjson';
  
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const outputStream = fs.createWriteStream(outputPath);
  let count = 0;
  let removed = 0;

  for await (const line of rl) {
    if (line.includes('\uFFFD') || line.includes('')) {
      removed++;
      continue;
    }
    try {
      const entry = JSON.parse(line);
      // Extra check for word sanity
      if (!entry.word || entry.word.includes('?') && entry.word.length < 2) {
         removed++;
         continue;
      }
      outputStream.write(line + '\n');
      count++;
    } catch (e) {
      removed++;
    }
  }

  console.log(`Finished! Kept: ${count}, Removed: ${removed}`);
}

cleanVocab();
