import winston from "winston";

const { timestamp, printf, combine } = winston.format;
const formatter = (log: Record<string, string>) =>
  `${log.timestamp} - ${log.level.toUpperCase()} - ${JSON.stringify(
    log.message
  )}`;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS" }),
    printf(formatter)
  ),
  transports: [new winston.transports.Console()],
});
