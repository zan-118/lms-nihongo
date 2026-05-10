const fs = require('fs');
const readline = require('readline');

const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

async function auditVocab() {
  const inputPath = 'vocab.ndjson';
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let total = 0;
  let good = 0;
  let bad = 0;

  for await (const line of rl) {
    total++;
    try {
      const entry = JSON.parse(line);
      if (jpRegex.test(entry.word)) {
        good++;
        if (good < 5) console.log("GOOD SAMPLE:", entry.word);
      } else {
        bad++;
      }
    } catch (e) {
      bad++;
    }
  }

  console.log(`Audit Results: Total: ${total}, Good (has JP): ${good}, Bad (trash): ${bad}`);
}

auditVocab();
