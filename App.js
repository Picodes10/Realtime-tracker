const express = require("express");
const app = express();

const path = require("path");
const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static('public')); // serve files from public directory
app.use(express.static('js'));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", {id: socket.id, ...data}); // send data to all connected clients
    });
  socket.on("disconnect", function(){
    io.emit("user-disconnected", socket.id)
  })
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
