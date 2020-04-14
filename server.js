import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import socketIo from 'socket.io'

// controllers
import authController from './controllers/auth-controller.js'
import roomController from './controllers/rooms-controller.js'

// middleware
import Middleware from './middleware/index.js'
import ErrorHandlingMiddleware from './middleware/error-handling.js'

import { authMiddleware, socketAuthMiddleware } from './middleware/auth.js'

dotenv.config()

const app = express()

Middleware(app)
authMiddleware(app)

app.use('/api/auth', authController)

// this middleware should be after routes
ErrorHandlingMiddleware(app)

// connect to db
mongoose.connect('mongodb://127.0.0.1:27017/chat').then(() => {
  console.log('database connected')
})

const server = http.createServer(app)

const io = socketIo(server)

const roomsNSP = io.of('/sockets/rooms')
roomsNSP.use(socketAuthMiddleware())

roomsNSP.on('connection', roomController(roomsNSP))

server.listen(3001)

// api details
// initial info (ROOM_INFO How many people are in this chat, ...)
// after some one joins (ROOM_JOINED info)
// after some one leaves (ROOM_LEFT info)
// is room occupied (ROOM_OCCUPIED)

// io.on('connection', function (socket) {
//   socket.on('disconnect', function(){
//     //console.log(io.sockets.adapter.sids[socket.id])
//     //const clients = await getClients(room)
//
//     //io.to(room).emit(ROOM_INFO, roomInfo(clients))
//   })
//
//   socket.on('disconnecting', function(){
//     console.log(Object.keys(io.sockets.adapter.sids[socket.id]))
//
//
//   })
//
//   socket.on('ready', async function ({ room }) {
//     socket.join(room)
//
//     const clients = await getClients(room)
//
//     io.to(room).emit(ROOM_INFO, roomInfo(clients))
//
//     // console.log(io.sockets.adapter.sids[socket.id])
//   })
//
//   socket.on('signal', function (data) {
//     console.log(data)
//     socket.broadcast.to(data.room).emit('signaling_message', data)
//   })
// })

//
