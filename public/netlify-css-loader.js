// Netlify CSS Loader
// This script ensures CSS files are loaded correctly on Netlify

(function() {
  // Immediately apply any stored theme to prevent FOUC
  function applyInitialTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
  
  // Apply theme immediately
  applyInitialTheme();
  
  // Function to load CSS with cache-busting
  function loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href + (href.includes('?') ? '&' : '?') + '_v=' + Date.now();
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
      
      document.head.appendChild(link);
    });
  }
  
  // Load critical CSS files first
  const criticalFiles = [
    '/critical.css',
    '/netlify-fixes.css',
    '/netlify-tailwind-reset.css'
  ];
  
  // Load build info to get all CSS files
  fetch('/build-info.json')
    .then(response => response.json())
    .then(buildInfo => {
      // First load critical files
      Promise.all(criticalFiles.map(file => loadCSS(file)))
        .then(() => {
          console.log('Critical CSS loaded');
          
          // Then load all CSS files from build info
          if (buildInfo.cssFiles) {
            const cssPromises = buildInfo.cssFiles
              .filter(file => file.endsWith('.css') && !criticalFiles.includes('/' + file))
              .map(file => loadCSS('/' + file));
              
            return Promise.all(cssPromises);
          }
        })
        .then(() => {
          console.log('All CSS files loaded');
          
          // Dispatch a custom event when all CSS is loaded
          document.dispatchEvent(new CustomEvent('NetlifyCSSLoaded'));
        })
        .catch(error => {
          console.error('Error loading CSS:', error);
          
          // Try to load the main Tailwind CSS as a last resort
          const mainCssFile = '/static/css/css-src_styles_globals_css-node_modules_next_font_google_target_css-node_modules_next_font_go-06cadc.css';
          loadCSS(mainCssFile)
            .then(() => console.log('Loaded main CSS file as fallback'))
            .catch(err => console.error('Failed to load main CSS file:', err));
        });
    })
    .catch(error => {
      console.error('Failed to load build info:', error);
      
      // Load critical files anyway
      Promise.all(criticalFiles.map(file => loadCSS(file)))
        .then(() => console.log('Critical CSS loaded (fallback)'))
        .catch(err => console.error('Failed to load critical CSS:', err));
    });
  
  // Add event listener to check if stylesheets are loaded correctly
  window.addEventListener('load', function() {
    setTimeout(function() {
      const styles = document.querySelectorAll('link[rel="stylesheet"]');
      let allLoaded = true;
      
      styles.forEach(style => {
        try {
          if (!style.sheet || style.sheet.cssRules.length === 0) {
            allLoaded = false;
            console.warn('CSS not loaded correctly:', style.href);
          }
        } catch (e) {
          // Cross-origin error, expected for some stylesheets
        }
      });
      
      if (!allLoaded) {
        console.log('Some CSS not loaded correctly, applying fallbacks');
        document.body.classList.add('css-fallback-applied');
      } else {
        console.log('All CSS loaded correctly');
      }
    }, 1000);
  });
})();
