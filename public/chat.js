//Make connection client side
const socket = io('http://localhost:4000');

//Query DOM
const handle = document.getElementById('handle')
const message = document.getElementById('message')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
let isTypingTimeout = null

//Emit Events
btn.addEventListener("click", () => {
    message.innerHTML='';
    socket.emit("chat", { 
        handle: handle.value ,
        message: message.value
     })
})

message.addEventListener("keypress", ()=>{
    socket.emit("typing", handle.value)
    clearTimeout(isTypingTimeout)
    isTypingTimeout = setTimeout(()=>{
        socket.emit("stopTyping", handle.value)
    }, 2000)
})

//Listen for events
socket.on('chat', data => {
    output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
})

socket.on('typingUsers', typingUsers => {
    console.log(typingUsers)
    if (typingUsers.length == 0) {
        feedback.innerHTML = ''
    }
    else if (typingUsers.length == 1) {
        feedback.innerHTML = `
            <p>
                <strong>${typingUsers[0]} is typing</strong>
            </p>
        `
    } else if (typingUsers.length > 1) {
        feedback.innerHTML = `
            <p>
                <strong>${typingUsers.join(', ')} are typing</strong>
            </p>
        `
    }
})