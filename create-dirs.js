const fs = require('fs');
const path = require('path');

try {
  // Create first directory
  const dir1 = 'C:\\Users\\Abthe\\Documents\\reactmastery\\LMS\\app\\data\\kit';
  fs.mkdirSync(dir1, { recursive: true });
  console.log('✓ Directory 1 created:', dir1);
  
  // Create second directory
  const dir2 = 'C:\\Users\\Abthe\\Documents\\reactmastery\\LMS\\app\\(public)\\kits\\[slug]';
  fs.mkdirSync(dir2, { recursive: true });
  console.log('✓ Directory 2 created:', dir2);
  
  // Verify both exist
  const exist1 = fs.existsSync(dir1);
  const exist2 = fs.existsSync(dir2);
  
  console.log('\n=== Verification ===');
  console.log('Directory 1 exists:', exist1 ? '✓ YES' : '✗ NO');
  console.log('Directory 2 exists:', exist2 ? '✓ YES' : '✗ NO');
  
  if (exist1 && exist2) {
    console.log('\n✓ Both directories successfully created!');
    process.exit(0);
  } else {
    console.log('\n✗ One or more directories failed to create');
    process.exit(1);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
