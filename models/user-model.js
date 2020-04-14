import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const Schema = mongoose.Schema

export const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

export const joiUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  rePassword: Joi.string().required().valid(Joi.ref('password'))
})

export const joiLoginSchema = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string().required()
})

export default mongoose.model('user', userSchema, 'users')

