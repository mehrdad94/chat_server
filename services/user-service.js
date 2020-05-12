import dotenv from 'dotenv'
import User from '../models/user-model.js'
import jwt from 'jsonwebtoken'
import PasswordHash from './password-hash.js'

dotenv.config()

export default class UserService {
  constructor() {
        this.passwordHash = new PasswordHash()
  }

  static async findByEmail (email) {
    return await User.findOne({ email })
  }

  static async findById (id) {
    return await User.findById(id)
  }

  async create (user) {
    user.password = await this.passwordHash.hash(user.password)

    return UserService.generateAccessToken(await User.create(user))
  }

  async deleteOne (email) {
    return await User.deleteOne({ email })
  }

  async signIn (email, password) {
    const user = await UserService.findByEmail(email)

    if (!user) return null

    if (await this.passwordHash.check(password, user.password)) return UserService.generateAccessToken(user)
    else return null
  }

  static generateAccessToken (user) {
    if (!user) {
      throw new Error('Invalid user')
    }

    user = user.toObject()

    delete user.password

    const payload = { user }
    return jwt.sign(payload, process.env.JWT_KEY, {
      algorithm: 'HS256',
      issuer: 'issuer',
      subject: user._id.toString()
    })
  }
}