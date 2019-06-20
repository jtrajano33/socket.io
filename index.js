const express = require("express");
const socket = require("socket.io")

//App setup
const app = express();

const server = app.listen(4000, ()=>{
    console.log("Listening to port 4000...")
})

//Static files
app.use(express.static('public'))

//Socket setup
const io = socket(server);

let typingUsers = []

io.on('connection', socket =>{
    console.log('Made socket connection', socket.id)

    const updateTypingUsers = () => {
        socket.broadcast.emit("typingUsers", typingUsers)
        console.log(typingUsers)
    }

    socket.on("chat", data =>{
        io.sockets.emit("chat", data) //io.sockets sends data to every socket connected to the server
    })

    socket.on("typing", name =>{
        if(typingUsers.indexOf(name) >= 0){
            return
        }
        console.log('A user is typing', name)
        typingUsers.push(name)
        updateTypingUsers()
    })

    socket.on("stopTyping", name => {
        typingUsers = typingUsers.filter(n => n !==name)
        updateTypingUsers();
    })
})