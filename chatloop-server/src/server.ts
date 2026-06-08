import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { initializeSocket } from "./socket";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

app.get("/", (_, res) => {
  res.send("ChatLoop API Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});