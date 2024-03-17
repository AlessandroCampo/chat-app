// import { socket } from '@/socket';
import express from 'express';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});



server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

io.on("connection", (socket) => {
    console.log(socket.id)
})