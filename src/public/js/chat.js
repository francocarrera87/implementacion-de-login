let myUserName= '';
let socket = io();


//mapa de chat.handlebars
const myUserNameTitle = document.getElementById('myUserNameTitle')
const messageInput = document.getElementById('messageInput')
const messagesLog = document.getElementById('messagesLog')


//escucha de mensajes
socket.on('chat messages', ({messages})=>{
    messagesLog.innerHTML= ''
    messages.forEach(m => {
        messagesLog.innerHTML+= `${m.user}: ${m.message}<br/>`
    });
})

//envi mensaje
messageInput.addEventListener('keyup',(e)=>{
    if(e.key == "Enter"){
        socket.emit('new message', {
            user: myUserName,
            message: e.target.value
        })
        e.target.value = ''
    }
})





//sweetalert2

Swal.fire({
    title: 'Login',
    text: 'Ingresa un nombre para continuar',
    input: 'email',
    allowOutsideClick: false,
  }).then((result) => {
    myUserName = result.value;
    userNameTitle.innerHTML = myUserName;
  })
  