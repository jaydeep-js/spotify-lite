import { connection, connect } from 'mongoose'

import { mongoose } from '../config'
import { Logger } from '../libs'

export const mongoInit = async () => {
  try {
    connection.once('open', async () => {
      Logger.info('Connected to MongoDB Server')

      connection.once('disconnected', () => {
        Logger.error('Connection disconnected to MongoDB Server')
      })
      connection.once('reconnected', () => {
        Logger.warn('Connection reconnected to MongoDB Server')
      })
      connection.once('error', (error) => {
        Logger.error('Connection error while connecting to MongoDB Server', {
          message: error.message
        })
      })
    })
    await connect(mongoose.connectionUri, { ...mongoose.options })
  } catch (error) {
    throw error
  }
}
