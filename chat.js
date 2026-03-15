const socket = io('http://localhost:5000'); // Your backend URL

const ChatModule = {
    init(currentUserId) {
        // Register user with Socket
        socket.emit('register_user', currentUserId);

        // Listen for incoming DMs
        socket.on('receive_message', (data) => {
            this.displayMessage(data, 'incoming');
            this.playNotificationSound();
        });

        // Listen for Project Chat
        socket.on('receive_project_message', (data) => {
            this.displayProjectMessage(data);
        });
    },

    sendMessage(receiverId, message) {
        const messageData = {
            senderId: currentUser.id,
            receiverId: receiverId,
            message: message,
            timestamp: new Date()
        };

        socket.emit('send_message', messageData);
        this.displayMessage(messageData, 'outgoing');
    },

    displayMessage(data, type) {
        const chatBox = document.getElementById('chat-history');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type === 'incoming' ? 'bg-gray-200' : 'bg-blue-600 text-white'} p-3 rounded-lg my-2 max-w-xs ${type === 'outgoing' ? 'ml-auto' : ''}`;
        msgDiv.innerText = data.message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    playNotificationSound() {
        // Optional: Add notification sound logic
    }
};
