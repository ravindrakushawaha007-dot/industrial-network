const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with your Hammerwold domain
        methods: ["GET", "POST"]
    }
});

// Store active users: { userId: socketId }
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    // 1. User Joins (Register their ID)
    socket.on('register_user', (userId) => {
        activeUsers.set(userId, socket.id);
        console.log(`User ${userId} is now online.`);
    });

    // 2. Direct Messaging
    socket.on('send_message', (data) => {
        const { senderId, receiverId, message, timestamp } = data;
        const receiverSocketId = activeUsers.get(receiverId);

        if (receiverSocketId) {
            // Send to specific user
            io.to(receiverSocketId).emit('receive_message', data);
            // Send notification
            io.to(receiverSocketId).emit('new_notification', {
                type: 'message',
                from: senderId,
                text: 'New message received'
            });
        }
        // Logic to save message to PostgreSQL table 'messages' goes here
    });

    // 3. Project Discussion (Room-based)
    socket.on('join_project_chat', (projectId) => {
        socket.join(`project_${projectId}`);
        console.log(`User joined discussion for project: ${projectId}`);
    });

    socket.on('send_project_message', (data) => {
        // Broadcast to everyone in that project room
        io.to(`project_${data.projectId}`).emit('receive_project_message', data);
    });

    socket.on('disconnect', () => {
        // Remove user from active list
        for (let [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                break;
            }
        }
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Hammerwold Real-time Server on ${PORT}`));
