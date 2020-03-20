const socket = io()

document.querySelector('#switch').addEventListener('change', ev => {
    socket.emit('switch', ev.target.checked)
})