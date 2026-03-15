const socketHandler = (io) => {
    const activeUsers = new Map();

    io.on('connection', (socket) => {
        socket.on('register_user', (userId) => {
            activeUsers.set(userId, socket.id);
        });

        socket.on('send_message', (data) => {
            const receiverSocketId = activeUsers.get(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', data);
            }
        });
        
        // Baki socket events yahan aayenge...
    });
};

module.exports = socketHandler;
