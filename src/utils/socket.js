const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const onlineUsers = new Map();


const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};



const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://devtinderfront.vercel.app",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(`${firstName} joined Room : ${roomId}`);
      
        socket.join(roomId);
        socket.userId = userId;
      
        // mark user as online
        onlineUsers.set(userId, { socketId: socket.id, lastSeen: null ,isOnline: true});
      
        // notify target user that current user is online
        socket.to(roomId).emit("userOnlineStatus", {
          incomingId: userId,
          isOnline: true,
        });
      
        //notify the joining user about the targetUser’s status
        const targetUserData = onlineUsers.get(targetUserId);
        socket.emit("userOnlineStatus", {
            incomingId: targetUserId,
            isOnline: targetUserData?.isOnline|| false,
            lastSeen: targetUserData?.lastSeen || null,
        });
      });
      
      

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);


          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          const lastMessage = chat.messages[chat.messages.length - 1];
          io.to(roomId).emit("messageReceived", { firstName, lastName, text,createdAt: lastMessage.createdAt });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
        const userId = socket.userId;
        if (userId) {
          const lastSeen = Date.now();
      
          // Store disconnect time
          onlineUsers.set(userId, {
            socketId: null,
            lastSeen: lastSeen,
            isOnline:false,
          });
      
          // Notify others
          socket.broadcast.emit("userOnlineStatus", {
            incomingId: userId,
            isOnline: false,
            lastSeen,
          });
        }
      });
      
  });
};

module.exports = initializeSocket;