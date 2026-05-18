const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function main() {
  console.log('Fetching N5 lessons with legacy category_id "N5-Course"...');
  
  // Query both drafts and published lessons with legacy category_id
  const query = '*[_type == "lesson" && category_id == "N5-Course"]';
  const docs = await client.fetch(query);
  
  console.log(`Found ${docs.length} documents to update.`);
  
  if (docs.length === 0) {
    console.log('No documents need patching.');
    return;
  }

  for (const doc of docs) {
    console.log(`Updating ${doc._id} (${doc.title || 'No Title'})...`);
    try {
      await client
        .patch(doc._id)
        .set({ category_id: 'n5' })
        .commit();
      console.log(`Successfully updated ${doc._id}`);
    } catch (err) {
      console.error(`Failed to update ${doc._id}:`, err);
    }
  }
  
  console.log('All legacy category_id values successfully updated in Sanity!');
}

main().catch(console.error);
