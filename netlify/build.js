// Custom build script for Netlify deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the Next.js build process
console.log('Building Next.js application...');
execSync('npm run build', { stdio: 'inherit' });

// Ensure _redirects is copied to the out directory
console.log('Copying Netlify configuration files...');
try {
  fs.copyFileSync(
    path.join(__dirname, '../public/_redirects'),
    path.join(__dirname, '../out/_redirects')
  );
  console.log('_redirects file copied successfully');
} catch (err) {
  console.error('Error copying _redirects file:', err);
}

// Create a Netlify-specific build tracking file
console.log('Creating build metadata...');
const buildInfo = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version
};

fs.writeFileSync(
  path.join(__dirname, '../out/build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('Build process completed successfully!');
