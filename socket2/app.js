const httpServer = require("http").createServer();


const io = require("socket.io")(httpServer, {
 allowEIO3: true,
  cors: {
    origin: "http://10.0.0.199:8080",
    methods: ["GET", "POST"]
,credentials: true
  }
});


var position = {
  x: 200,
  y: 200,
};

io.on("db", (socket) => {
console.log(123)
console.log( socket  )
  //socket.emit("position", position);
});

io.on("connection", (socket) => {
  socket.emit("position", position);
});

httpServer.listen(1337, "10.0.0.199", () => {
  console.log("1337...");
});
