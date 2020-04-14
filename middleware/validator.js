import { joiUserSchema, joiLoginSchema } from '../models/user-model.js'
import { joiRoomSchema, joiRoomJoinSchema, joiRoomUpdateSchema, joiRoomDeleteSchema } from '../models/room-model.js'

import ValidationError from '../errors/validation-error.js'

'use strict'

let validators = {
  'User': {
    scopes: {
      default: joiUserSchema,
      login: joiLoginSchema
    }
  },
  'Room': {
    scopes: {
      CREATE: joiRoomSchema,
      JOIN: joiRoomJoinSchema,
      UPDATE: joiRoomUpdateSchema,
      DELETE: joiRoomDeleteSchema
    }
  }
}

function scopeExists (validator, scope) {
  return Object.keys(validator.scopes).find(key => key === scope) !== undefined
}

function getSchema (model, scope) {
  let validator = validators[model]

  if (!validator) throw new Error('validator does not exist')

  // has multiple scopes
  if (validator.scopes) {
    if (scope) {
      if (!scopeExists(validator, scope)) throw new Error(`Scope ${scope} does not exist in ${model} validator`)
      else return validator.scopes[scope]
    } else return validator.scopes.default
  } else return validator
}

function validate (model, object, scope) {
  return getSchema(model, scope).validate(object, {
    allowUnknown: true
  })
}

export default function ValidationMiddleware (model, scope, isSocket = false) {
  if (isSocket) {
    return (data, next) => {
      if (!scopeExists(validators[model], data[0])) return next()

      const validationResult = validate(model, data[1], data[0])

      if (validationResult.error) {
        if (data[2] && typeof data[2] === 'function') data[2](new ValidationError(validationResult.error.details, model))
        else next(new ValidationError(validationResult.error.details, model), true)
      } else return next()
    }
  } else {
    return (req, res, next) => {
      const validationResult = validate(model, req.body, scope)
      if (validationResult.error) throw new ValidationError(validationResult.error.details, model)
      else next()
    }
  }
}
