const express = require("express");
const { ExpressPeerServer } = require("peer");
const app = express();
const httpServer = require("http").createServer(app);

const cors = require("cors");
app.use(cors());

const io = require("socket.io")(httpServer, {
  cors: {
    // origin: process.env.HOST,
    origin: "*",
  },
});
const peerServer = ExpressPeerServer(httpServer, {
  path: "/myapp",
});

app.use("/peerjs", peerServer);

const online_users = {};

io.on("connection", (socket) => {
  const senderId = socket.handshake.query.id;
  socket.join(senderId);
  online_users[senderId] = true;
  socket.broadcast.emit("hello-from", senderId);

  // listening on send-message event
  socket.on("send-message", ({ peopleIds, text }) => {
    peopleIds.forEach((curId) => {
      let listOfRecipients = peopleIds.filter((personId) => personId !== curId);
      listOfRecipients.push(senderId);

      socket.broadcast.to(curId).emit("receive-message", {
        peopleIds: listOfRecipients,
        sender: senderId,
        text,
      });
    });
  });

  socket.on("check-online-status", (user_socket_id) => {
    if (online_users[user_socket_id]) {
      socket.emit("hello-from", user_socket_id);
    } else {
      socket.emit("bye-from", user_socket_id);
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("bye-from", senderId);
    delete online_users[senderId];
  });

  socket.on("call-user", ({ userId }) => {
    socket.broadcast.to(userId).emit("receive-call", {
      senderId,
    });
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT);
