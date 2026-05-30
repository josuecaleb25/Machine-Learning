const HTML_TAG_REGEX = /<[^>]*>/g;

export function stripHtml(value) {
  if (typeof value !== 'string') return value;
  return value.replace(HTML_TAG_REGEX, '').trim();
}

export function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return stripHtml(value).replace(/\0/g, '');
}

export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeObject(value);
  }
  return result;
}
