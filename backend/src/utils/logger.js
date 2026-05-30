import { env } from '../config/env.js';

const levels = { error: 0, warn: 1, info: 2, debug: 3 };

function shouldLog(level) {
  const current = env.NODE_ENV === 'production' ? 1 : 3;
  return levels[level] <= current;
}

export const logger = {
  error: (...args) => shouldLog('error') && console.error('[ERROR]', ...args),
  warn: (...args) => shouldLog('warn') && console.warn('[WARN]', ...args),
  info: (...args) => shouldLog('info') && console.info('[INFO]', ...args),
  debug: (...args) => shouldLog('debug') && console.debug('[DEBUG]', ...args),
};
