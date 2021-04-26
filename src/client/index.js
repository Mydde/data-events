const io = require("socket.io-client");

console.log('hello');
const socket = io('http://127.0.0.1:4000');
 

// client-side
socket.on("connect", (extra) => {
    console.log(extra,'connected',socket.id);
  });
  