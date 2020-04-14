import CustomError from './custom-error.js'

export default class UserDuplicateError extends CustomError {
  constructor (message) {
    super(message)
  }
}
