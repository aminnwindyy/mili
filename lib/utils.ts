// Minimal utility implementations used across the app

export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | number | Date) {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('fa-IR');
}

export function formatRelativeTime(date: string | number | Date) {
  const d = new Date(date).getTime();
  const diff = Date.now() - d;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.round(hours / 24);
  return `${days} روز پیش`;
}

export function formatNumber(value: number, locale = 'fa-IR') {
  return new Intl.NumberFormat(locale).format(value || 0);
}

export function formatCurrency(value: number, currency = 'IRR', locale = 'fa-IR') {
  if (!isFinite(Number(value))) return '0';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function formatCompactCurrency(value: number, locale = 'fa-IR') {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value || 0);
}

export function formatPercentage(value: number, fractionDigits = 1) {
  if (!isFinite(Number(value))) return '0%';
  return `${Number(value).toFixed(fractionDigits)}%`;
}

export function truncateText(text: string, maxLen = 100) {
  if (!text) return '';
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

export function capitalizeFirst(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTitleCase(text: string) {
  if (!text) return '';
  return text
    .split(' ')
    .map((t) => (t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : ''))
    .join(' ');
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhoneNumber(phone: string) {
  return /^\+?\d{8,15}$/.test(phone);
}

export function isValidNationalId(id: string) {
  return typeof id === 'string' && id.length >= 8;
}

export function groupBy<T>(items: T[], key: (item: T) => string | number) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(key(item));
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

export function sortBy<T>(items: T[], selector: (item: T) => string | number, dir: 'asc' | 'desc' = 'asc') {
  const m = dir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = selector(a);
    const bv = selector(b);
    return av > bv ? m : av < bv ? -m : 0;
  });
}

export function uniqueBy<T>(items: T[], key: (item: T) => string | number) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = String(key(item));
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const s = new Set<string>(keys as unknown as string[]);
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) if (!s.has(k)) out[k] = v;
  return out as Omit<T, K>;
}

export function debounce<F extends (...args: any[]) => void>(fn: F, wait = 200) {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function throttle<F extends (...args: any[]) => void>(fn: F, wait = 200) {
  let last = 0;
  let timer: any;
  return (...args: Parameters<F>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, wait - (now - last));
    }
  };
}

export function getFromStorage(key: string) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

export function setToStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromStorage(key: string) {
  localStorage.removeItem(key);
}

export function buildUrl(base: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(base, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  if (params) for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
  return url.toString();
}

export function parseQueryString(qs: string) {
  const urlSearchParams = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
  return Object.fromEntries(urlSearchParams.entries());
}

export function formatFileSize(bytes: number) {
  if (!isFinite(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

export function getFileExtension(filename: string) {
  const i = filename.lastIndexOf('.');
  return i === -1 ? '' : filename.slice(i + 1).toLowerCase();
}

export function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isToday(date: string | number | Date) {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function isYesterday(date: string | number | Date) {
  const d = new Date(date);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
}


