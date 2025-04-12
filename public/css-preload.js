// CSS Preload Script for Netlify deployments
(function() {
  // Check if we're running on Netlify
  const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('legal-tutor.ayzkestudio.com');
  
  if (!isNetlify) return;

  console.log('CSS Preload: Running on Netlify environment');
  
  // Set up MutationObserver to check for CSS links
  function setupCssObserver() {
    let cssMonitorStartTime = Date.now();
    let cssLoadComplete = false;
    
    // Function to check if stylesheets are loaded
    function checkStylesheets() {
      const styles = document.querySelectorAll('link[rel="stylesheet"]');
      let loaded = true;
      
      for (let i = 0; i < styles.length; i++) {
        if (!styles[i].sheet) {
          loaded = false;
          break;
        }
        
        try {
          if (styles[i].sheet.cssRules.length === 0) {
            loaded = false;
            break;
          }
        } catch (e) {
          // Cross-origin error, ignore
          if (e.name !== 'SecurityError') {
            loaded = false;
            break;
          }
        }
      }
      
      return loaded;
    }
    
    // Observer for head changes
    const headObserver = new MutationObserver(mutations => {
      // Check if CSS is loaded
      if (cssLoadComplete) return;
      
      if (checkStylesheets()) {
        console.log('CSS Preload: All stylesheets loaded successfully');
        cssLoadComplete = true;
        headObserver.disconnect();
        return;
      }
      
      // If we've been waiting too long (5s), force reload CSS
      if (Date.now() - cssMonitorStartTime > 5000 && !cssLoadComplete) {
        console.log('CSS Preload: Timeout waiting for CSS, forcing reload');
        reloadStylesheets();
        cssLoadComplete = true;
        headObserver.disconnect();
      }
    });
    
    // Start observing
    headObserver.observe(document.head, { 
      childList: true, 
      subtree: true 
    });
    
    // Check immediately as well
    setTimeout(() => {
      if (!cssLoadComplete && checkStylesheets()) {
        console.log('CSS Preload: All stylesheets loaded successfully on check');
        cssLoadComplete = true;
        headObserver.disconnect();
      }
    }, 1000);
    
    // Set final check timeout
    setTimeout(() => {
      if (!cssLoadComplete) {
        console.log('CSS Preload: Final check for CSS loading');
        if (!checkStylesheets()) {
          console.log('CSS Preload: Still not loaded, forcing reload');
          reloadStylesheets();
        }
        headObserver.disconnect();
      }
    }, 5000);
  }
  
  // Function to reload stylesheets if they fail to load
  function reloadStylesheets() {
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    const loadedSheets = new Set();
    
    styles.forEach(style => {
      // Skip if we've already processed this href
      if (style.href && loadedSheets.has(style.href)) return;
      
      // Try reloading the stylesheet with a cache-busting parameter
      if (style.href) {
        loadedSheets.add(style.href);
        
        const url = new URL(style.href);
        url.searchParams.set('t', Date.now());
        
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = url.toString();
        
        // Add to document
        document.head.appendChild(newLink);
        console.log('CSS Preload: Reloaded stylesheet', url.toString());
      }
    });
    
    // Also ensure our fallback CSS is loaded
    ['critical.css', 'netlify-fixes.css', 'netlify-tailwind-reset.css'].forEach(cssFile => {
      const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                      .some(link => link.href && link.href.includes(cssFile));
      
      if (!exists) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/${cssFile}?t=${Date.now()}`;
        document.head.appendChild(link);
        console.log('CSS Preload: Added fallback stylesheet', cssFile);
      }
    });
  }
  
  // Set up the observer when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCssObserver);
  } else {
    setupCssObserver();
  }
})();
