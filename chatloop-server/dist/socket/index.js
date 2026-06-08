"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const queue_1 = __importDefault(require("./queue"));
const rooms_1 = require("./rooms");
const events_1 = require("./events");
const crypto_1 = __importDefault(require("crypto"));
const userProfiles = new Map();
function getProfile(socketId) {
    return (userProfiles.get(socketId) ?? {
        username: `User${Math.floor(1000 + Math.random() * 9000)}`,
        age: "",
        gender: "",
        country: "",
    });
}
function initializeSocket(io) {
    const broadcastStats = () => {
        const count = io.sockets.sockets.size;
        let maleCount = 0;
        let femaleCount = 0;
        for (const p of userProfiles.values()) {
            if (p.gender === "male")
                maleCount++;
            else if (p.gender === "female")
                femaleCount++;
        }
        io.emit("online-count", { count, maleCount, femaleCount });
    };
    const leaveRoom = (socket, roomId, notifyPartner = true) => {
        const room = rooms_1.activeRooms.get(roomId);
        if (!room)
            return;
        if (notifyPartner) {
            const partnerId = room.user1 === socket.id ? room.user2 : room.user1;
            io.to(partnerId).emit("stranger-disconnected");
        }
        rooms_1.activeRooms.delete(roomId);
        socket.leave(roomId);
    };
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);
        broadcastStats();
        socket.on("set-profile", (profile) => {
            userProfiles.set(socket.id, profile);
            broadcastStats();
        });
        socket.on(events_1.SOCKET_EVENTS.FIND_MATCH, () => {
            if (queue_1.default.length > 0) {
                const partnerId = queue_1.default.shift();
                const partnerSocket = io.sockets.sockets.get(partnerId);
                if (!partnerSocket) {
                    queue_1.default.push(socket.id);
                    return;
                }
                const roomId = crypto_1.default.randomUUID();
                socket.join(roomId);
                partnerSocket.join(roomId);
                rooms_1.activeRooms.set(roomId, {
                    roomId,
                    user1: socket.id,
                    user2: partnerId,
                });
                const myProfile = getProfile(socket.id);
                const partnerProfile = getProfile(partnerId);
                console.log(`Match: [${myProfile.username}] <-> [${partnerProfile.username}] in room ${roomId}`);
                socket.emit(events_1.SOCKET_EVENTS.MATCH_FOUND, {
                    roomId,
                    strangerProfile: partnerProfile,
                });
                partnerSocket.emit(events_1.SOCKET_EVENTS.MATCH_FOUND, {
                    roomId,
                    strangerProfile: myProfile,
                });
            }
            else {
                queue_1.default.push(socket.id);
                console.log(`Waiting: ${socket.id} — queue length: ${queue_1.default.length}`);
            }
        });
        socket.on(events_1.SOCKET_EVENTS.SEND_MESSAGE, ({ roomId, message }) => {
            socket.to(roomId).emit(events_1.SOCKET_EVENTS.RECEIVE_MESSAGE, { message });
        });
        socket.on(events_1.SOCKET_EVENTS.NEXT_STRANGER, ({ roomId }) => {
            leaveRoom(socket, roomId, true);
            socket.emit("searching");
        });
        socket.on("typing", ({ roomId }) => {
            socket.to(roomId).emit("typing");
        });
        socket.on("report-user", ({ roomId, reason }) => {
            console.log(`Report in room ${roomId}: ${reason}`);
        });
        socket.on("disconnect", () => {
            const index = queue_1.default.indexOf(socket.id);
            if (index !== -1)
                queue_1.default.splice(index, 1);
            for (const [roomId, room] of rooms_1.activeRooms.entries()) {
                if (room.user1 === socket.id || room.user2 === socket.id) {
                    const partnerId = room.user1 === socket.id ? room.user2 : room.user1;
                    io.to(partnerId).emit("stranger-disconnected");
                    rooms_1.activeRooms.delete(roomId);
                    break;
                }
            }
            userProfiles.delete(socket.id);
            console.log("User Disconnected:", socket.id);
            broadcastStats();
        });
    });
}
