const fs = require('fs');
const readline = require('readline');

const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

async function auditVocabDeep() {
  const inputPath = 'vocab.ndjson';
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let total = 0;
  let wordOk = 0;
  let examplesOk = 0;
  let furiganaOk = 0;
  let totalOk = 0;

  for await (const line of rl) {
    total++;
    try {
      const entry = JSON.parse(line);
      const isWordOk = jpRegex.test(entry.word);
      const isFuriganaOk = jpRegex.test(entry.furigana) || /^[a-zA-Z]/.test(entry.furigana); // can be romaji
      
      let isExamplesOk = true;
      if (entry.examples && entry.examples.length > 0) {
         isExamplesOk = entry.examples.every(ex => jpRegex.test(ex.japanese));
      }

      if (isWordOk) wordOk++;
      if (isFuriganaOk) furiganaOk++;
      if (isExamplesOk) examplesOk++;

      if (isWordOk && isFuriganaOk && isExamplesOk && !line.includes('\uFFFD')) {
        totalOk++;
      }
    } catch (e) {
      // skip
    }
  }

  console.log(`Deep Audit Results:
Total: ${total}
Word OK: ${wordOk}
Furigana OK: ${furiganaOk}
Examples OK: ${examplesOk}
Fully Valid: ${totalOk}
Garbage: ${total - totalOk}`);
}

auditVocabDeep();
