export default class CustomError extends Error {
  constructor (message) {
    super(message)
    this.type = 'ERROR'
    this.name = this.constructor.name
  }
}
