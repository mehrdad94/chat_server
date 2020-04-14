import bCrypt from 'bcrypt'

export default class PasswordHash {
  constructor () {
    this.rounds = 10
  }
  async hash (password) {
    return await bCrypt.hash(password, this.rounds)
  }
  async check (password, hash) {
    return await bCrypt.compare(password, hash)
  }
}