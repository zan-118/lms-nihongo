const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function cleanup() {
  console.log('🚀 Starting Sanity cleanup...');
  
  // Query for IDs and current examples that have null items
  const query = `*[_type in ["vocab", "kanji"] && count(examples[@ == null]) > 0]{_id, examples}`;
  const docs = await client.fetch(query);
  
  console.log(`🔍 Found ${docs.length} documents with null examples.`);

  if (docs.length === 0) {
    console.log('✅ No corrupted documents found.');
    return;
  }

  // Process in batches of 50 to avoid hitting limits
  const batchSize = 50;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    console.log(`[${i + batch.length}/${docs.length}] Processing batch...`);
    
    const transaction = client.transaction();
    
    batch.forEach(doc => {
      if (doc.examples) {
        const cleanExamples = doc.examples.filter(e => e != null);
        transaction.patch(doc._id, p => p.set({ examples: cleanExamples }));
      }
    });
    
    await transaction.commit();
  }

  console.log('✨ Cleanup complete!');
}

cleanup().catch(err => {
  console.error('❌ Cleanup failed:', err.message);
  process.exit(1);
});
