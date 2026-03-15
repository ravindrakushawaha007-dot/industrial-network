// Function called within Socket.io 'send_message' logic
const saveMessageToDB = async (senderId, receiverId, message) => {
    const query = `
        INSERT INTO messages (sender_id, receiver_id, message_body)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [senderId, receiverId, message];
    // Use your pg client to execute
    // await pool.query(query, values);
};
