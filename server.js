const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Allow CORS for all origins (important for dev/testing)
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Handle socket connection
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // 🔌 Listen for incoming Odu messages from sender
  socket.on('send_message', (odu) => {
    if (!odu) {
      console.error('⚠️ Received empty Odu payload!');
      return;
    }

    console.log('📨 Odu sent from sender:', odu);

    // 🔁 Broadcast the Odu to all other clients (receiver)
    socket.broadcast.emit('receive_message', odu); // send to everyone except sender
    // You can also use: io.emit(...) to send to all including sender
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Run the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
