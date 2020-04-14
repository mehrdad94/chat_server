import CustomError from './custom-error.js'

export default class RoomDuplicateError extends CustomError {
  constructor (message) {
    super(message)
  }
}
