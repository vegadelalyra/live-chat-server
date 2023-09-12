const io = require('socket.io')(3000, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
      credentials: true
    }
  })
console.log('dead')
const users = {}

io.on('connection', socket => {
    // wpp makaiapp 
    socket.on('wpp-session-on', phoneNumber => {
        console.log('WPP USER CONNECTED')
        socket.broadcast.emit('wpp-contact-on', phoneNumber)
    })

    socket.on('send-wpp-message', (message, receptorPhoneNumber) => {
        socket.broadcast.emit('wpp-message', { message: message, receptorPhoneNumber: receptorPhoneNumber })
    })
    
    // general chat app
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

