/**
 * Cleans up URLs that might have been escaped when stored in the database
 * Handles various URL formats and removes escape characters
 */
export function cleanUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Convert to string in case it's not
  let clean = String(url);
  
  // Remove all backslashes
  clean = clean.replace(/\\/g, '');
  
  // Clean up any double slashes that might result from the above
  clean = clean.replace(/([^:])(\/\/+)/g, '$1/');
  
  // If the URL is not already an absolute URL, prepend the base URL
  if (!clean.startsWith('http') && !clean.startsWith('https')) {
    // Remove any leading slashes to avoid double slashes
    clean = clean.replace(/^\/+/, '');
    clean = `https://ik.imagekit.io/davidrocha/${clean}`;
  }
  
  // Log the before and after for debugging
  if (url !== clean) {
    console.log('Cleaned URL:', { original: url, cleaned: clean });
  }
  
  return clean;
}
