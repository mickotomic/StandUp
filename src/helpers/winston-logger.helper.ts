import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}]${timestamp} ${message}`;
});

export const emailLogger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to
    // `combined.log`
    //
    new transports.File({ filename: 'logs/mail/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/mail/info.log', level: 'info' }),
  ],
});
