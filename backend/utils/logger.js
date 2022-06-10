const { createLogger, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

module.exports = createLogger({
  format: format.combine(
    format.splat(),
    // timestamp
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // add color for log
    format.colorize(),
    format.printf((log) => {
      // stack trace or message
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(process.cwd() + '/logs', '..', 'logs', `%DATE%.log`),
      datePattern: 'YYYY_MM_DD-HH',
      zippedArchive: true,
      maxFiles: '10d',
    }),
  ],
});
