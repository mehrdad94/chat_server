import chalk from 'chalk'
import { ValidationError, AuthenticationError, AccessDeniedError, UserDuplicateError } from '../errors/index.js'

function errorLogger (err, req, res, next) {
  if (err.message) chalk.red(err.message)
  if (err.stack) console.log(chalk.red(err.message))
  next(err)
}

function authenticationErrorHandler (err, req, res, next) {
  if (err instanceof AuthenticationError) return res.status(401).json({ meta: { error: err }})

  next(err)
}

function validationErrorHandler (err, req, res, next) {
  if (err instanceof ValidationError) return res.status(400).json({ meta: { error: err }})

  next(err)
}

function userDuplicateErrorHandler (err, req, res, next) {
  if (err instanceof UserDuplicateError) return res.status(400).json({ meta: { error: err }})

  next(err)
}

function accessDeniedErrorHandler (err, req, res, next) {
  if (err instanceof AccessDeniedError) return res.sendStatus(403)

  next(err)
}

function genericErrorHandler (err, req, res, next) {
  res.sendStatus(500)
  next()
}

export default function ErrorHandlingMiddleware (app) {
  app.use([
    errorLogger,
    authenticationErrorHandler,
    validationErrorHandler,
    userDuplicateErrorHandler,
    accessDeniedErrorHandler,
    genericErrorHandler
  ])
}
