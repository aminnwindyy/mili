export { cn, formatDate, formatRelativeTime, formatCurrency, formatCompactCurrency, formatNumber, formatPercentage, truncateText, capitalizeFirst, formatTitleCase, isValidEmail, isValidPhoneNumber, isValidNationalId, groupBy, sortBy, uniqueBy, pick, omit, debounce, throttle, getFromStorage, setToStorage, removeFromStorage, buildUrl, parseQueryString, formatFileSize, getFileExtension, hexToRgb, rgbToHex, generateId, randomBetween, sleep, isToday, isYesterday } from './lib/utils';

export function createPageUrl(name) {
  return `/${name}`;
}
