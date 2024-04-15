import express from "express";
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { Chat } from "./chat.schema.js";
const app = express();

// Creating server using http.
export const server = http.createServer(app);

// Create socket server.
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
let connectedUsers = [];
io.on('connection', (socket) => {
  console.log("Connection is established");

  socket.on("join", async(data) => {
    socket.username = data;
    connectedUsers.push(socket.username);
    io.emit("update_users", connectedUsers);
  
    await Chat.find().sort({ timestamp: 1 }).limit(50)
      .then(messages => {
        socket.emit("load_messages", messages);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
      });
  });
  
  socket.on('new_message', async(message) => {
    let userMessage = {
      username: socket.username,
      message: message
    }
  
    const newChat = new Chat({
      username: socket.username,
      message: message,
      timestamp: new Date()
    });
  
    return await newChat.save()
      .then(() => {
        socket.broadcast.emit('broadcast_message', userMessage);
      })
      .catch(err => {
        console.error("Error saving message:", err);
      });
  });
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", socket.username);
});
socket.on("stop_typing", () => {
  socket.broadcast.emit("stop_typing");
});
  

  socket.on("disconnect", () => {
    
    console.log("connection is disconnected");
    // Remove the disconnected user from the connectedUsers array
    const index = connectedUsers.indexOf(socket.username);
    if (index > -1) {
      connectedUsers.splice(index, 1);
    }
    
    // Send updated connected users list to all clients
    io.emit("update_users", connectedUsers);
  });
});