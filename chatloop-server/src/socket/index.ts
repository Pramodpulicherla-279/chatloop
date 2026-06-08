import { Server, Socket } from "socket.io";
import waitingUsers from "./queue";
import { activeRooms } from "./rooms";
import { SOCKET_EVENTS } from "./events";
import crypto from "crypto";

const userProfiles = new Map<string, { username: string; age: string; country: string }>();

function getProfile(socketId: string) {
  return userProfiles.get(socketId) ?? {
    username: `User${Math.floor(1000 + Math.random() * 9000)}`,
    age: "",
    country: "",
  };
}

export function initializeSocket(io: Server) {

  const broadcastOnlineCount = () => {
    io.emit("online-count", { count: io.sockets.sockets.size });
  };

  io.on("connection", (socket: Socket) => {
    console.log("User Connected:", socket.id);
    broadcastOnlineCount();

    socket.on("set-profile", (profile: { username: string; age: string; country: string }) => {
      userProfiles.set(socket.id, profile);
      console.log(`Profile saved [${socket.id}]: ${profile.username}`);
    });

    socket.on(SOCKET_EVENTS.FIND_MATCH, () => {
      if (waitingUsers.length > 0) {
        const partnerId = waitingUsers.shift()!;
        const partnerSocket = io.sockets.sockets.get(partnerId);

        // Partner disconnected while waiting — put self in queue
        if (!partnerSocket) {
          waitingUsers.push(socket.id);
          return;
        }

        const roomId = crypto.randomUUID();
        socket.join(roomId);
        partnerSocket.join(roomId);

        activeRooms.set(roomId, {
          roomId,
          user1: socket.id,
          user2: partnerId,
        });

        const myProfile      = getProfile(socket.id);
        const partnerProfile = getProfile(partnerId);

        console.log(`Match: [${myProfile.username}] <-> [${partnerProfile.username}] in room ${roomId}`);

        socket.emit(SOCKET_EVENTS.MATCH_FOUND, { roomId, strangerProfile: partnerProfile });
        partnerSocket.emit(SOCKET_EVENTS.MATCH_FOUND, { roomId, strangerProfile: myProfile });

      } else {
        waitingUsers.push(socket.id);
        console.log(`Waiting: ${socket.id} — queue length: ${waitingUsers.length}`);
      }
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, ({ roomId, message }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, { message });
    });

    socket.on(SOCKET_EVENTS.NEXT_STRANGER, ({ roomId }) => {
      socket.leave(roomId);
      activeRooms.delete(roomId);
      socket.emit("searching");
    });

    socket.on("typing", ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("typing");
    });

    socket.on("report-user", ({ roomId, reason }: { roomId: string; reason: string }) => {
      console.log(`Report in room ${roomId}: ${reason}`);
    });

    socket.on("disconnect", () => {
      const index = waitingUsers.indexOf(socket.id);
      if (index !== -1) waitingUsers.splice(index, 1);
      userProfiles.delete(socket.id);
      console.log("User Disconnected:", socket.id);
      broadcastOnlineCount();
    });
  });
}