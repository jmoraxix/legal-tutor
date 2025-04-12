// netlifyconfig.js - CSS loading utilities for Netlify deployment

(function() {
  // Helper function to fix CSS loading issues
  window.fixCSSLoading = function() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const mainSheet = Array.from(stylesheets).find(link => 
      link.href && link.href.includes('globals_css'));
    
    if (mainSheet && (!mainSheet.sheet || mainSheet.sheet.cssRules.length === 0)) {
      console.log('Main stylesheet not loaded correctly, reloading with cache busting');
      
      // Create a new stylesheet element with cache busting
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      const url = new URL(mainSheet.href);
      url.searchParams.set('t', new Date().getTime());
      newLink.href = url.toString();
      
      // Add the new stylesheet
      document.head.appendChild(newLink);
      
      // Also reload the critical CSS and reset CSS as a backup
      ['critical.css', 'netlify-fixes.css', 'netlify-tailwind-reset.css'].forEach(cssFile => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/${cssFile}?t=${new Date().getTime()}`;
        document.head.appendChild(link);
      });
      
      return true;
    }
    
    return false;
  };

  // Check stylesheet loading on page load
  window.addEventListener('load', function() {
    // Give a short delay to allow regular CSS loading
    setTimeout(function() {
      const fixed = window.fixCSSLoading();
      if (fixed) {
        console.log('CSS loading fixed');
      } else {
        console.log('CSS loaded correctly');
      }
    }, 500);
  });
  
  // Try to apply theme as early as possible
  function applyTheme() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Apply dark mode based on system preference if no saved theme
      document.documentElement.classList.add('dark');
    }
  }
  
  // Apply theme immediately
  applyTheme();
})();
