// Post-build patch script for Netlify
const fs = require('fs');
const path = require('path');

// Output directory
const outputDir = path.join(__dirname, '../out');

// Function to process HTML files
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      patchHtmlFile(filePath);
    }
  }
}

// Function to patch a single HTML file
function patchHtmlFile(filePath) {
  console.log(`Processing HTML file: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add our CSS loader script
  if (!content.includes('netlify-css-loader.js')) {
    content = content.replace(
      /<head([^>]*)>/,
      '<head$1>\n    <script src="/netlify-css-loader.js"></script>'
    );
  }
  
  // Make sure critical CSS files are included
  if (!content.includes('critical.css')) {
    content = content.replace(
      /<head([^>]*)>/,
      '<head$1>\n    <link rel="stylesheet" href="/critical.css">'
    );
  }
  
  if (!content.includes('netlify-tailwind-reset.css')) {
    content = content.replace(
      /<head([^>]*)>/,
      '<head$1>\n    <link rel="stylesheet" href="/netlify-tailwind-reset.css">'
    );
  }
  
  // Add inline critical CSS
  const criticalCssInline = `
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; }
      .dark body { background-color: #1e293b; color: #f8fafc; }
      h1, h2, h3, h4, h5, h6 { font-family: Georgia, serif; }
      .legal-button { background-color: #475569; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
      .dark .legal-button { background-color: #94a3b8; color: #1e293b; }
    </style>
  `;
  
  if (!content.includes('<style')) {
    content = content.replace(
      /<head([^>]*)>/,
      '<head$1>' + criticalCssInline
    );
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Patched HTML file: ${filePath}`);
}

// Main function
function main() {
  console.log('Starting post-build patch process...');
  
  // Process all HTML files
  processHtmlFiles(outputDir);
  
  console.log('Post-build patch process completed.');
}

// Run the script
main();
