// Custom build script for Netlify deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { processHTMLFiles } = require('./_document');

// Run the Next.js build process
console.log('Building Next.js application...');
execSync('npm run build', { stdio: 'inherit' });

// Process HTML files to enhance CSS loading
console.log('Processing HTML files for CSS optimization...');
processHTMLFiles(path.join(__dirname, '../out'));

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

// Copy all CSS files from the public directory to ensure they're available
const copyPublicCSS = () => {
  const publicDir = path.join(__dirname, '../public');
  const outputDir = path.join(__dirname, '../out');
  
  // Find all CSS files in the public directory
  const cssFiles = fs.readdirSync(publicDir)
    .filter(file => file.endsWith('.css'))
    .map(file => path.join(publicDir, file));
  
  // Copy them to the output directory
  cssFiles.forEach(file => {
    const fileName = path.basename(file);
    const destPath = path.join(outputDir, fileName);
    
    fs.copyFileSync(file, destPath);
    console.log(`Copied ${fileName} to ${destPath}`);
  });
  
  return cssFiles.length;
};

// Copy CSS files
const copiedCount = copyPublicCSS();
console.log(`Copied ${copiedCount} CSS files from public directory`);

// List all CSS files in the output directory for verification
const listOutputCSS = () => {
  const outputDir = path.join(__dirname, '../out');
  let cssFiles = [];
  
  // Function to find CSS files
  const findCssFiles = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findCssFiles(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    });
  };
  
  findCssFiles(outputDir);
  return cssFiles;
};

// List CSS files
const outputCssFiles = listOutputCSS();
console.log(`Found ${outputCssFiles.length} CSS files in output directory:`);
outputCssFiles.forEach(file => {
  console.log(` - ${path.relative(path.join(__dirname, '../out'), file)}`);
});

// Create a Netlify-specific build tracking file
console.log('Creating build metadata...');
const buildInfo = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  cssFiles: outputCssFiles.map(file => path.relative(path.join(__dirname, '../out'), file))
};

fs.writeFileSync(
  path.join(__dirname, '../out/build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('Build process completed successfully!');

// Run post-build patch
console.log('Running post-build patch...');
require('./post-build-patch');
