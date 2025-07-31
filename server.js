// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('send_message', (odu) => {
    if (!odu) {
      console.error('⚠️ Received empty Odu payload!');
      return;
    }

    console.log('📨 Odu sent from sender:', odu);
    socket.broadcast.emit('receive_message', odu);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Use dynamic port for Render, fallback to 3001 locally
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
