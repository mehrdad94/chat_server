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

const isDevelopment = process.env.NODE_ENV === 'development'

// connect to db
const mongoURL = isDevelopment ? process.env.MONGO_URL_DEVELOPMENT : process.env.MONGO_URL_PRODUCTION
mongoose.connect(mongoURL).then(() => {
  console.log('database connected')
})

const server = http.createServer(app)

const io = socketIo(server)

const roomsNSP = io.of('/sockets/rooms')
roomsNSP.use(socketAuthMiddleware())

roomsNSP.on('connection', roomController(roomsNSP))

const serverPort = isDevelopment ? process.env.PORT : process.env.PORT_PRODUCTION
server.listen(serverPort)
