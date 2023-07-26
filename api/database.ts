import {connect} from 'mongoose'
import {logger} from './logger'
import {config} from './config'

export async function connectToDatabase() {
  try {
    const connectionString = config.mongooseDatabase
    await connect(connectionString)
    logger.info('Connected to Mongoose')
  } catch (error) {
    logger.error(error)
  }
}
