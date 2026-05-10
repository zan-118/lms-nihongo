const fs = require('fs');
const readline = require('readline');

const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

async function cleanVocab() {
  const inputPath = 'vocab.ndjson';
  const outputPath = 'vocab.cleaned.ndjson';
  
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const outputStream = fs.createWriteStream(outputPath);
  let kept = 0;
  let removed = 0;

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      const isWordOk = jpRegex.test(entry.word);
      const isFuriganaOk = jpRegex.test(entry.furigana) || /^[a-zA-Z]/.test(entry.furigana);
      
      let isExamplesOk = true;
      if (entry.examples && entry.examples.length > 0) {
         isExamplesOk = entry.examples.every(ex => jpRegex.test(ex.japanese));
      }

      if (isWordOk && isFuriganaOk && isExamplesOk && !line.includes('\uFFFD')) {
        outputStream.write(line + '\n');
        kept++;
      } else {
        removed++;
      }
    } catch (e) {
      removed++;
    }
  }

  console.log(`Cleaned! Kept: ${kept}, Removed: ${removed}`);
}

cleanVocab();
