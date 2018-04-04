
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4000
const app = express()
const server = http.createServer(app)

const io = socketIO(server)

let pixels=[];

io.on('connection', socket => {
  console.log('Nueva conexión')
  
  socket.on('add pixel', (pixel) => {
    console.log('Pixel: ',pixel)
    pixels.push(pixel);
    io.sockets.emit('render pixel', pixels)
  })
  
  socket.on('disconnect', () => {
    console.log('Alguien se peló')
  })
})

server.listen(port, () => console.log(`Escuchando en el puerto ${port}`))