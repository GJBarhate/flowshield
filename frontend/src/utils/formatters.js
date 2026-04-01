import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInMilliseconds,
} from 'date-fns';

/**
 * Format ISO date string to readable date
 * @param {string} isoString
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'MMM d, yyyy \'at\' h:mm a');
  } catch {
    return '—';
  }
};

/**
 * Format ISO date string to relative time
 * @param {string} isoString
 * @returns {string}
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return '—';
  try {
    const date = parseISO(isoString);
    const diff = differenceInMilliseconds(new Date(), date);
    if (diff < 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    if (diff < 24 * 60 * 60 * 1000) {
      return format(date, 'h:mm a');
    }
    return format(date, 'MMM d');
  } catch {
    return '—';
  }
};

/**
 * Format duration between two timestamps
 * @param {string|null} startIso
 * @param {string|null} endIso
 * @returns {string}
 */
export const formatDuration = (startIso, endIso) => {
  if (!startIso || !endIso) return '—';
  try {
    const ms = differenceInMilliseconds(parseISO(endIso), parseISO(startIso));
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  } catch {
    return '—';
  }
};

/**
 * Truncate a MongoDB ID or long string
 * @param {string} id
 * @param {number} length
 * @returns {string}
 */
export const truncateId = (id, length = 8) => {
  if (!id) return '—';
  if (id.length <= length) return id;
  return `${id.slice(0, length)}...`;
};

/**
 * Pretty-print a payload object safely
 * @param {*} obj
 * @returns {string}
 */
export const formatPayload = (obj) => {
  try {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value;
      },
      2
    );
  } catch {
    return String(obj);
  }
};

/**
 * Capitalize first letter of status string
 * @param {string} status
 * @returns {string}
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
};
