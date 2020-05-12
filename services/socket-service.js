import chalk from 'chalk'
import pick from 'ramda/src/pick.js'

export const socketGetUser = socket => socket.decoded_token.user

export const socketGetSafeUser = socket => pick(['avatar', '_id', 'name'], socketGetUser(socket))

export const socketGetUserId = socket => socket.decoded_token.user._id

export const socketRoomJoin = (socket, roomId) => { socket.join(roomId) }
export const socketRoomLeave = (socket, roomId) => { socket.leave(roomId, error => { error && console.log(chalk.red(error))}) }

export const socketRoomClientsRead = (namespace, roomId) => {
  const clients = namespace.adapter.rooms[roomId].sockets

  if (!clients) return []

  return Object.keys(clients).map(socketId => namespace.connected[socketId])
}

export const socketRoomUserIds = (namespace, roomId) => socketRoomClientsRead(namespace, roomId).map(socketGetUserId)

export const socketRoomOnlineUsers = (room, namespace) => {
  return {
    roomId: room._id.toString(),
    userIds: socketRoomUserIds(namespace, room._id.toString()),
    users: socketRoomClientsRead(namespace, room._id.toString()).map(socketGetSafeUser)
  }
}