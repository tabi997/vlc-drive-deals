/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates if a URL is from an allowed domain (prevents SSRF)
 */
export const isValidAutovitUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedDomains = ['www.autovit.ro', 'autovit.ro'];
    return allowedDomains.includes(urlObj.hostname.toLowerCase());
  } catch {
    return false;
  }
};

/**
 * Sanitizes a string to prevent XSS by escaping HTML entities
 */
export const sanitizeString = (input: string | null | undefined): string => {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validates UUID format
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Validates and sanitizes a URL
 */
export const sanitizeUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
};

