import CustomError from './custom-error.js'

export default class RoomNotExistError extends CustomError {
  constructor (message) {
    super(message)
  }
}
