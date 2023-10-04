import express, { json, urlencoded } from 'express'
import compression from 'compression'
import cors from 'cors'

import { port, appURL, middleware } from './config'
import { Routes } from './routes'
import { mongoInit } from './app'
import { Logger } from './libs'
import path from 'path'

let server

const initializeApp = () => {
  const app = express()

  app.use(express.static(path.join(__dirname, '../public')))
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '../public/views'))

  app.use(cors({
    methods: middleware.methodsAllowed,
    origin: '*'
  }))

  app.use(json({ limit: middleware.bodySizeLimit }))
  app.use(urlencoded({ limit: middleware.bodySizeLimit, extended: false, parameterLimit: middleware.bodyParameterLimit }))
  app.use(compression())

  Routes.init(app)

  app.use((req, res) => {
    return res.render('home')
  })

  return app
}

(async () => {
  try {
    await mongoInit()
    const app = initializeApp()

    server = app.listen(port, () => {
      Logger.info(`Server listening at ${appURL}`)
    })
  } catch (error) {
    Logger.error('Bootstrap Server', {
      message: error.message
    })
    throw error
  }
})()

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  Logger.error('Bootstrap Server:: unexpectedErrorHandler', {
    message: error.message
  })
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
process.on('SIGTERM', () => {
  server.close()
})
