const express = require("express");
const app = express();
const PORT = "3001";
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send(`Connected to PORT ${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);

  socket.on("send", async (data) => {
    await socket.broadcast.emit("receive", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
