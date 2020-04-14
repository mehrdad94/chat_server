import express from 'express'

import asyncWrapper from '../utilities/async-wrapper.js'
import validator from '../middleware/validator.js'
import UserService from '../services/user-service.js'
import { AuthenticationError, UserDuplicateError }from '../errors/index.js'

const router = express.Router()

const userService = new UserService()

// POST api/auth/login
router.post('/login', [validator('User', 'login')], asyncWrapper(async (req, res) => {
  const { email, password } = req.body
  const token = await userService.signIn(email, password)

  if (!token) throw new AuthenticationError('Invalid Credentials')
  else res.json(token)
}))

// POST api/auth/register
router.post('/register', [validator('User')], asyncWrapper(async (req, res) => {
  if (!await UserService.findByEmail(req.body.email)) {
    const token = await userService.create(req.body)
    res.json(token)
  } else throw new UserDuplicateError()
}))

export default router
