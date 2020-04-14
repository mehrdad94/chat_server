import Room from '../models/room-model.js'

export default class RoomService {
  static async findAll (userId) {
    return await Room.find({ members: userId })
  }

  static async findOne (publicId) {
    return await Room.findOne({ publicId })
  }

  static async findById (id) {
    return await Room.findById(id)
  }

  static async deleteOne (publicId) {
    return await Room.deleteOne({ publicId })
  }

  static async create (room) {
    return await Room.create(room)
  }

  static async update (publicId, newRoom) {
    const room = await Room.findOne({ publicId })

    Object.assign(room, newRoom)

    await room.save()

    return room
  }

  static async join (userId, publicId) {
    const room = await Room.findOne({ publicId, members: { '$ne': userId } })

    if (room) {
      room.members.push(userId)
      await room.save()

      return room
    } else return null
  }
}
