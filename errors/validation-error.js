import CustomError from './custom-error.js'

const errorPrettify = errors => {
  return errors.reduce((object, err) => {
    object[err.context.key] = err.message
    return object
  }, {})
}

export default class ValidationError extends CustomError {
  constructor (errors, model) {
    super(errors)
    const prettifiedErrors = errorPrettify(errors)
    this.model = model
    this.errors = prettifiedErrors
    this.message = { type: 'ERROR', name: this.constructor.name, model: this.model, errors: prettifiedErrors }
  }
}
