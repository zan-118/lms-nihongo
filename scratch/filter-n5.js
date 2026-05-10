const fs = require('fs');

const INPUT_FILE = 'vocab_pass1.json';
const OUTPUT_FILE = 'vocab.ndjson';

function getProcessedIds() {
    if (!fs.existsSync(OUTPUT_FILE)) return new Set();
    const content = fs.readFileSync(OUTPUT_FILE, 'utf8').split('\n').filter(Boolean);
    const ids = new Set();
    content.forEach(line => {
        try {
            const obj = JSON.parse(line);
            if (obj._id) ids.add(obj._id);
        } catch (e) {}
    });
    return ids;
}

function filterN5() {
    const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    const processedIds = getProcessedIds();
    
    // Filter only N5 that are not processed
    const n5Items = rawData.filter(item => 
        item.jlptLevel === 'N5' && !processedIds.has(item._id)
    );

    console.log(`📊 N5 Statistik:`);
    console.log(`- Total N5 di Pass1: ${rawData.filter(i => i.jlptLevel === 'N5').length}`);
    console.log(`- Sisa N5 yang perlu diproses: ${n5Items.length}`);
    
    if (n5Items.length > 0) {
        fs.writeFileSync('vocab_n5_to_process.json', JSON.stringify(n5Items, null, 2));
        console.log(`✅ File antrean dibuat: vocab_n5_to_process.json`);
    } else {
        console.log(`✅ Semua N5 sudah ada di ${OUTPUT_FILE}`);
    }
}

filterN5();
