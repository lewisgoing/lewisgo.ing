// scripts/test-blob-upload.js
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function main() {
  // Check for required environment variables
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Missing BLOB_READ_WRITE_TOKEN environment variable');
    console.error('Please add it to your .env.local file');
    process.exit(1);
  }

  try {
    // Path to a test file
    const testFilePath = path.resolve(process.cwd(), 'public/audio/closer.mp3');
    console.log(`Reading file: ${testFilePath}`);
    
    // Read the test file
    const fileBuffer = fs.readFileSync(testFilePath);
    
    console.log(`Uploading test file (${fileBuffer.length} bytes)...`);
    
    // Upload to Vercel Blob
    const blob = await put('test/closer.mp3', fileBuffer, {
      access: 'public',
      contentType: 'audio/mpeg',
    });
    
    console.log('✅ Successfully uploaded test file!');
    console.log(`URL: ${blob.url}`);
    console.log(`Upload completed successfully!`);
    
    // Create .env.local contents to copy
    console.log('\nAdd the following to your .env.local file:');
    console.log(`NEXT_PUBLIC_USE_VERCEL_BLOB=true`);
    console.log(`NEXT_PUBLIC_VERCEL_BLOB_URL=${new URL('/', blob.url).origin}`);
    
  } catch (error) {
    console.error('❌ Error uploading test file:');
    console.error(error);
  }
}

main().catch(console.error);