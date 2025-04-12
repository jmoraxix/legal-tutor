// This is a custom document generator for Netlify
const fs = require('fs');
const path = require('path');

// Function to extract the CSS links from the Next.js generated HTML
function extractCSSLinks(htmlContent) {
  const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g;
  const matches = [...htmlContent.matchAll(cssLinkRegex)];
  return matches.map(match => match[1]);
}

// Function to inject CSS preload tags
function injectCSSPreloads(htmlContent, cssLinks) {
  const headEndIndex = htmlContent.indexOf('</head>');
  if (headEndIndex === -1) return htmlContent;
  
  const preloadTags = cssLinks.map(href => 
    `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">`
  ).join('\n');
  
  return htmlContent.slice(0, headEndIndex) + 
         preloadTags + 
         htmlContent.slice(headEndIndex);
}

// Function to inject the CSS fallback script
function injectCSSFallbackScript(htmlContent) {
  const fallbackScript = `
  <script>
    // Fallback script for CSS loading
    (function() {
      var cssMain = document.createElement('link');
      cssMain.rel = 'stylesheet';
      cssMain.href = '/critical.css';
      document.head.appendChild(cssMain);
      
      // Create a script to check if primary CSS has loaded
      var cssCheck = document.createElement('script');
      cssCheck.innerHTML = \`
        (function() {
          var checkInterval = setInterval(function() {
            const styles = document.querySelectorAll('link[rel="stylesheet"]');
            let allLoaded = true;
            
            styles.forEach(function(style) {
              try {
                if (!style.sheet || style.sheet.cssRules.length === 0) {
                  allLoaded = false;
                }
              } catch (e) {
                // Cross-origin stylesheet error - expected
              }
            });
            
            if (allLoaded) {
              clearInterval(checkInterval);
              console.log('All styles loaded successfully');
            } else {
              console.log('Retrying stylesheet loading...');
              // Retry loading the primary stylesheets
              styles.forEach(function(style) {
                if (style.getAttribute('data-retry') !== 'true') {
                  var newLink = style.cloneNode(true);
                  newLink.setAttribute('data-retry', 'true');
                  newLink.href = style.href + '?retry=' + Date.now();
                  document.head.appendChild(newLink);
                }
              });
            }
          }, 1000);
          
          // Stop checking after 10 seconds to avoid infinite loops
          setTimeout(function() {
            clearInterval(checkInterval);
          }, 10000);
        })();
      \`;
      document.head.appendChild(cssCheck);
    })();
  </script>
  `;
  
  const headEndIndex = htmlContent.indexOf('</head>');
  if (headEndIndex === -1) return htmlContent;
  
  return htmlContent.slice(0, headEndIndex) + 
         fallbackScript + 
         htmlContent.slice(headEndIndex);
}

// Main function to process HTML files
function processHTMLFiles(outputDir) {
  const indexPath = path.join(outputDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found in', outputDir);
    return;
  }
  
  // Process the index.html file
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  const cssLinks = extractCSSLinks(indexContent);
  
  indexContent = injectCSSPreloads(indexContent, cssLinks);
  indexContent = injectCSSFallbackScript(indexContent);
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('Enhanced index.html with CSS preloading');
  
  // Process all other HTML files in the output directory
  processDirectory(outputDir, cssLinks);
}

// Recursively process all HTML files in a directory
function processDirectory(dirPath, cssLinks) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      processDirectory(fullPath, cssLinks);
    } else if (file.endsWith('.html') && file !== 'index.html') {
      let htmlContent = fs.readFileSync(fullPath, 'utf8');
      htmlContent = injectCSSPreloads(htmlContent, cssLinks);
      htmlContent = injectCSSFallbackScript(htmlContent);
      
      fs.writeFileSync(fullPath, htmlContent);
      console.log('Enhanced', fullPath, 'with CSS preloading');
    }
  }
}

module.exports = { processHTMLFiles };
