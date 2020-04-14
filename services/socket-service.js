export const socketGetUser = socket => socket.decoded_token.user

export const socketGetUserId = socket => socket.decoded_token.user._id

export const socketRoomJoin = (socket, roomId) => {
  socket.join(roomId)
}

export const socketRoomClientsRead = (namespace, roomId) => {
  return namespace.in(roomId).sockets
}

export const socketRoomUserIds = (namespace, roomId) => Object.values(socketRoomClientsRead(namespace, roomId)).map(socketGetUserId)
