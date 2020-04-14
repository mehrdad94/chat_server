import mongoose from 'mongoose'
import Joi from '@hapi/joi'

const Schema = mongoose.Schema

const roomSchema = new Schema({
  creator: {
    type: String, // user id
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  notification: {
    type: Number,
    default: 0
  },
  members: {
    type: [String], // user id
    default: []
  },
  publicId: {
    type: String,
    required: true
  }
})

export const joiRoomSchema = Joi.object().keys({
  name: Joi.string().required(),
  avatar: Joi.string(),
  publicId: Joi.string().required()
})

export const joiRoomJoinSchema = Joi.object().keys({
  publicId: Joi.string().required()
})

export const joiRoomUpdateSchema = Joi.object().keys({
  publicId: Joi.string().required(),
  newPublicId: Joi.string(),
  name: Joi.string(),
  avatar: Joi.string()
})

export const joiRoomDeleteSchema = Joi.object().keys({
  publicId: Joi.string().required()
})

export default mongoose.model('room', roomSchema, 'rooms')
