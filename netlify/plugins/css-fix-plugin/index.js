// Netlify plugin to fix CSS loading issues
const fs = require('fs');
const path = require('path');

module.exports = {
  onPostBuild: async ({ constants, utils }) => {
    const { PUBLISH_DIR } = constants;
    
    console.log('CSS Fix Plugin: Starting CSS optimization process');
    
    // Function to find CSS files in the build output
    const findCssFiles = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findCssFiles(filePath, fileList);
        } else if (file.endsWith('.css')) {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    };
    
    // Find all CSS files
    const cssFiles = findCssFiles(PUBLISH_DIR);
    console.log(`CSS Fix Plugin: Found ${cssFiles.length} CSS files`);
    
    // Create a CSS manifest file
    const manifest = {
      cssFiles: cssFiles.map(file => '/' + path.relative(PUBLISH_DIR, file).replace(/\\/g, '/')),
      buildTime: new Date().toISOString()
    };
    
    // Write the manifest file
    const manifestPath = path.join(PUBLISH_DIR, 'css-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`CSS Fix Plugin: Created CSS manifest at ${manifestPath}`);
    
    // Update HTML files to include the CSS manifest
    const updateHtmlFiles = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          updateHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Add the CSS fix script before </head>
          if (content.includes('</head>')) {
            const cssFixScript = `
              <script>
                // Load CSS manifest to ensure all CSS files are loaded
                fetch('/css-manifest.json')
                  .then(response => response.json())
                  .then(manifest => {
                    // Preload all CSS files from the manifest
                    manifest.cssFiles.forEach(file => {
                      const link = document.createElement('link');
                      link.rel = 'preload';
                      link.as = 'style';
                      link.href = file + '?t=' + manifest.buildTime;
                      link.onload = function() {
                        this.onload = null;
                        this.rel = 'stylesheet';
                      };
                      document.head.appendChild(link);
                    });
                  })
                  .catch(err => {
                    console.error('Failed to load CSS manifest:', err);
                  });
              </script>
            `;
            
            content = content.replace('</head>', cssFixScript + '</head>');
            fs.writeFileSync(filePath, content);
            console.log(`CSS Fix Plugin: Updated ${filePath}`);
          }
        }
      });
    };
    
    // Update all HTML files
    updateHtmlFiles(PUBLISH_DIR);
    console.log('CSS Fix Plugin: Completed CSS optimization process');
  }
};
