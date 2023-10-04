import { pick } from '../utilities'

const customLogger = console

export const Logger = {
  error: (message, data = {}, metaData = {}) => {
    customLogger.error({ level: 'error', timestamp: new Date(), message, metaData: pick(metaData, ['retire100ReqID', 'url', 'ip']), data })
  },
  warn: (message, data = {}, metaData = {}) => {
    customLogger.warn({ level: 'warn', timestamp: new Date(), message, metaData: pick(metaData, ['retire100ReqID', 'url', 'ip']), data })
  },
  info: (message, data = {}, metaData = {}) => {
    customLogger.info({ level: 'info', timestamp: new Date(), message, metaData: pick(metaData, ['retire100ReqID', 'url', 'ip']), data })
  }
}
