// scripts/migrate-to-blob.js
const { put } = require('@vercel/blob');
const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Define file types to migrate
const AUDIO_EXTENSIONS = ['.mp3', '.wav'];
const SVG_EXTENSIONS = ['.svg'];

// Map of original file paths to their new Blob URLs
const migrationMap = {};

// Counter for processed files
let uploadedCount = 0;
let skippedCount = 0;
let errorCount = 0;

/**
 * Recursively scans a directory and uploads files with matching extensions
 */
async function scanAndUploadDirectory(directory, baseDir = directory) {
  try {
    console.log(`Scanning directory: ${directory}`);
    const entries = await fsPromises.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await scanAndUploadDirectory(fullPath, baseDir);
      } else {
        const extension = path.extname(entry.name).toLowerCase();
        
        // Check if this is a file type we want to migrate
        if ([...AUDIO_EXTENSIONS, ...SVG_EXTENSIONS].includes(extension)) {
          // Determine content type based on extension
          let contentType = 'application/octet-stream';
          if (AUDIO_EXTENSIONS.includes(extension)) {
            contentType = 'audio/mpeg';
          } else if (extension === '.svg') {
            contentType = 'image/svg+xml';
          }
          
          // Upload to Vercel Blob
          await uploadFile(fullPath, entry.name, contentType, baseDir);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directory}:`, error);
    errorCount++;
  }
}

/**
 * Uploads a single file to Vercel Blob
 */
async function uploadFile(filePath, fileName, contentType, baseDir) {
  try {
    // Create a relative path for storage based on the structure under baseDir
    const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/'); // Normalize for all platforms
    
    console.log(`📦 Uploading: ${relativePath}`);
    
    // Read file content
    const fileBuffer = await fsPromises.readFile(filePath);
    
    // Upload to Vercel Blob
    const blob = await put(relativePath, fileBuffer, {
      access: 'public',
      contentType,
    });
    
    // Store the mapping from original path to new URL
    migrationMap[relativePath] = blob.url;
    
    console.log(`✅ Uploaded: ${relativePath} -> ${blob.url}`);
    uploadedCount++;
    
    return blob.url;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error);
    errorCount++;
    return null;
  }
}

/**
 * Generates environment variables for .env.local
 */
async function generateEnvironmentFile() {
  try {
    // Get the base URL from the first URL in the migration map
    const entries = Object.entries(migrationMap);
    
    if (entries.length === 0) {
      console.log('No files were migrated.');
      return;
    }
    
    const firstUrl = entries[0][1];
    const baseUrl = new URL('/', firstUrl).origin;
    
    // Create environment variables content
    const envContent = `# Vercel Blob settings
NEXT_PUBLIC_USE_VERCEL_BLOB=true
NEXT_PUBLIC_VERCEL_BLOB_URL=${baseUrl}
`;
    
    // Write to .env.blob file
    fs.writeFileSync('.env.blob', envContent);
    
    console.log('✅ Generated environment variables in .env.blob');
    console.log('   Add these to your .env.local file to use Vercel Blob URLs');
  } catch (error) {
    console.error('Error generating environment file:', error);
  }
}

/**
 * Main function to run the migration
 */
async function migrate() {
  console.log('Starting migration to Vercel Blob...');
  
  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is missing!');
    console.error('Please add it to your .env.local file or environment variables.');
    process.exit(1);
  }
  
  // Directories to scan
  const directories = [
    './public/audio',
    './public/svg'
  ];
  
  // Process each directory
  for (const dir of directories) {
    try {
      if (fs.existsSync(dir)) {
        console.log(`🔍 Processing directory: ${dir}`);
        await scanAndUploadDirectory(dir);
      } else {
        console.warn(`⚠️ Directory ${dir} does not exist. Skipping.`);
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  }
  
  // Generate environment file
  await generateEnvironmentFile();
  
  console.log('\n🎉 Migration summary:');
  console.log(`  Files uploaded: ${uploadedCount}`);
  console.log(`  Files skipped: ${skippedCount}`);
  console.log(`  Errors: ${errorCount}`);
  
  console.log('\nNext steps:');
  console.log('1. Add the environment variables from .env.blob to your .env.local file');
  console.log('2. Restart your development server');
  console.log('3. Test that your assets are loading from Vercel Blob');
}

// Run the migration
migrate().catch(error => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
});