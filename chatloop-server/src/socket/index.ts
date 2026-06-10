import { Server, Socket } from "socket.io";
import waitingUsers from "./queue";
import { activeRooms } from "./rooms";
import { SOCKET_EVENTS } from "./events";
import crypto from "crypto";

type UserProfile = {
  username: string;
  age: string;
  gender: string;
  country: string;
};

const userProfiles = new Map<string, UserProfile>();

function getProfile(socketId: string): UserProfile {
  return (
    userProfiles.get(socketId) ?? {
      username: `User${Math.floor(1000 + Math.random() * 9000)}`,
      age: "",
      gender: "",
      country: "",
    }
  );
}

export function initializeSocket(io: Server) {
  const broadcastStats = () => {
    const count = io.sockets.sockets.size;
    let maleCount = 0;
    let femaleCount = 0;
    for (const p of userProfiles.values()) {
      if (p.gender === "male") maleCount++;
      else if (p.gender === "female") femaleCount++;
    }
    io.emit("online-count", { count, maleCount, femaleCount });
  };

  const leaveRoom = (socket: Socket, roomId: string, notifyPartner = true) => {
    const room = activeRooms.get(roomId);
    if (!room) return;
    if (notifyPartner) {
      const partnerId =
        room.user1 === socket.id ? room.user2 : room.user1;
      io.to(partnerId).emit("stranger-disconnected");
    }
    activeRooms.delete(roomId);
    socket.leave(roomId);
  };

  io.on("connection", (socket: Socket) => {
    console.log("User Connected:", socket.id);
    broadcastStats();

    socket.on("set-profile", (profile: UserProfile) => {
      userProfiles.set(socket.id, profile);
      broadcastStats();
    });

    socket.on(SOCKET_EVENTS.FIND_MATCH, () => {
      // Always remove self from queue first — prevents self-match when the
      // user re-searches while their own ID is still sitting in the queue
      // (e.g. clicking Next while already in "searching" state).
      const selfIndex = waitingUsers.indexOf(socket.id);
      if (selfIndex !== -1) waitingUsers.splice(selfIndex, 1);

      if (waitingUsers.length > 0) {
        const partnerId = waitingUsers.shift()!;
        const partnerSocket = io.sockets.sockets.get(partnerId);

        // Safety guard: never match a socket with itself
        if (partnerId === socket.id || !partnerSocket) {
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

        const myProfile = getProfile(socket.id);
        const partnerProfile = getProfile(partnerId);

        console.log(
          `Match: [${myProfile.username}] <-> [${partnerProfile.username}] in room ${roomId}`
        );

        socket.emit(SOCKET_EVENTS.MATCH_FOUND, {
          roomId,
          strangerProfile: partnerProfile,
        });
        partnerSocket.emit(SOCKET_EVENTS.MATCH_FOUND, {
          roomId,
          strangerProfile: myProfile,
        });
      } else {
        waitingUsers.push(socket.id);
        console.log(
          `Waiting: ${socket.id} — queue length: ${waitingUsers.length}`
        );
      }
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, ({ roomId, message }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, { message });
    });

    socket.on(SOCKET_EVENTS.NEXT_STRANGER, ({ roomId }) => {
      // Also purge from queue in case the user was still waiting
      const idx = waitingUsers.indexOf(socket.id);
      if (idx !== -1) waitingUsers.splice(idx, 1);

      leaveRoom(socket, roomId, true);
      socket.emit("searching");
    });

    socket.on("typing", ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("typing");
    });

    socket.on(
      "report-user",
      ({ roomId, reason }: { roomId: string; reason: string }) => {
        console.log(`Report in room ${roomId}: ${reason}`);
      }
    );

    socket.on("disconnect", () => {
      const index = waitingUsers.indexOf(socket.id);
      if (index !== -1) waitingUsers.splice(index, 1);

      for (const [roomId, room] of activeRooms.entries()) {
        if (room.user1 === socket.id || room.user2 === socket.id) {
          const partnerId =
            room.user1 === socket.id ? room.user2 : room.user1;
          io.to(partnerId).emit("stranger-disconnected");
          activeRooms.delete(roomId);
          break;
        }
      }

      userProfiles.delete(socket.id);
      console.log("User Disconnected:", socket.id);
      broadcastStats();
    });
  });
}
