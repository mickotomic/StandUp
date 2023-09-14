import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, type, message, timestamp }) => {
  return `[${level}] ${timestamp} [${type}] ${message}`;
});

export const emailLogger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: 'logs/mail/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/mail/info.log', level: 'info' }),
  ],
});

export const appLogger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: 'logs/app/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/app/info.log', level: 'info' }),
  ],
});
