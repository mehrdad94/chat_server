import validator from '../middleware/validator.js'
import asyncWrapper from '../utilities/async-wrapper.js'
import RoomService from '../services/room-service.js'

import { removeEmptyFromObject } from '../utilities/helpers.js'
import { socketRoomJoin, socketRoomUserIds, socketGetUser, socketRoomClientsRead } from '../services/socket-service.js'
import { RoomDuplicateError, RoomNotExistError } from '../errors/index.js'

// TODO pass user information without password
// TODO pass online user information on room create
// TODO create connection greed

// helpers
const runClb = (clb, data) => { if (clb && typeof clb === 'function') clb(data) }

export default namespace => async socket => {
  // middleware
  socket.use(validator('Room', null, true))

  // token info
  const user = socketGetUser(socket)
  const userId = user._id

  // user rooms
  const userRooms = await RoomService.findAll(userId)

  // associate each room to socket room
  userRooms.forEach(room => {
    socketRoomJoin(socket, room._id)

    socket.to(room._id).emit('JOINED', user, room._id)
  })

  // send information that user needs
  socket.emit('CURRENT_USER', user)
  socket.emit('READ', userRooms)

  const onlineUsers = userRooms.map(room => {
    return {
      roomId: room._id,
      userIds: socketRoomUserIds(namespace, room._id),
      users: Object.values(socketRoomClientsRead(namespace, room._id)).map(socketGetUser)
    }
  })

  socket.emit('ONLINE_USERS', onlineUsers)

  // handle on disconnect
  socket.on('disconnect', () => {
    userRooms.forEach(room => {
      socket.to(room._id).emit('DISCONNECTED', user, room._id)
    })
  })

  // handle on create
  socket.on('CREATE', asyncWrapper(async ({ name, avatar = '', publicId }, clb) => {
    if (!await RoomService.findOne(publicId)) {
      const room = { creator: userId, name, avatar, publicId, members: [userId] }

      const result = await RoomService.create(room)

      runClb(clb, result)

      socket.emit('CREATE', result)

      socketRoomJoin(socket, result._id)
    } else runClb(clb, new RoomDuplicateError())
  }, true))

  socket.on('UPDATE', asyncWrapper(async ({ name, avatar = '', newPublicId, publicId }, clb) => {
    if (await RoomService.findOne(newPublicId)) runClb(clb, new RoomDuplicateError())
    else if (await RoomService.findOne(publicId)) {
      const room = { name, avatar, publicId: newPublicId }

      removeEmptyFromObject(room)

      const result = await RoomService.update(publicId, room)

      runClb(clb, result)

      namespace.in(result._id).emit('UPDATE', result)
    } else runClb(clb, new RoomNotExistError())
  }, true))

  // delete
  socket.on('DELETE', asyncWrapper(async ({ publicId }, clb) => {
    const room = await RoomService.findOne(publicId)

    if (!room) return
    if (room.creator !== userId) return

    await RoomService.deleteOne(publicId)

    namespace.in(room._id).emit('DELETE', room)

    runClb(clb, room)
  }))

  // handle join to a room
  socket.on('JOIN', asyncWrapper(async ({ publicId }, clb) => {
    const room = await RoomService.join(userId, publicId)

    if (room) {
      socket.emit('CREATE', room)

      socketRoomJoin(socket, room._id)
      socket.to(room._id).emit('JOINED', user)

      runClb(clb, room)
    } else runClb(clb, new RoomNotExistError())
  }, true))

  // pass WebRTC signals
  socket.on('SIGNAL', asyncWrapper(async ({ roomId, receiverId, senderId, candidate, desc }) => {
    const room = await RoomService.findById(roomId)
    const clients = Object.values(socketRoomClientsRead(namespace, roomId))

    if (!room || clients.length === 0) return

    const targetSocket = clients.find(client => socketGetUser(client)._id === receiverId)

    if (!targetSocket) return

    targetSocket.emit('SIGNAL', { roomId, receiverId, senderId, candidate, desc })
  }))
}
