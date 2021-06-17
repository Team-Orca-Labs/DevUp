const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const { userRouter, matchRouter, authRouter } = require("./routes");
const { createTables } = require("./models");
const { NODE_ENV } = require("./env");

// middleware
app.use(express.json());
app.use(cors());

// static
if (NODE_ENV === "development") {
  app.use(express.static(path.resolve(__dirname, "./client-dev")));
  app.use("/test", express.static(path.resolve(__dirname, "./client-dev")));
}
app.use(express.static(path.resolve(__dirname, "../client/dist")));

//*****************************************************************************
//socket.io
//*****************************************************************************

//checks for if username is present
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

//send all existing users to clie
io.on("connection", (socket) => {
  console.log("socket", socket);
  const users = [];
  //loop over object of all currently connected Socket instances indexed by ID
  console.log("io.of", io.of("/").sockets);
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      id: id,
      userId: socket.handshake.auth.userId,
      username: socket.username,
    });
  }
  console.log("connection established");
  socket.emit("users", users);

  // notify existing users that user has connected
  socket.broadcast.emit("user connected", {
    id: socket.handshake.auth.userId,
    username: socket.username,
  });
  socket.on("private message", ({ content, to }) => {
    //emits to 'to' which is the given userId passed from client on private message event
    //emits message from socket id
    socket.to(to).emit("private message", {
      content,
      from: socket.handshake.auth.userId,
    });
  });
});

//emits message to specific userId - selectedUser.userID

// routers
app.use("/users", userRouter);
app.use("/matches", matchRouter);
app.use("/auth", authRouter);

// 404
app.use((req, res) => {
  res.status(404).json({});
});

// error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({});
});

// start
createTables()
  .then(() => {
    server.listen(3001, () => {
      console.log("server started");
    });
  })
  .catch((err) => console.log(err));
