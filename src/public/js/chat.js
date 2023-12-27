const socket = io();
//Formulario
const chatInput = document.getElementById("chat-input");
const user = document.getElementById("user");
const message = document.getElementById("message");

chatInput.addEventListener("submit", (evt) => {
  socket.emit("new-message", { user: user.value, message: message.value });
  chatInput.reset();
});

//Logs

const logs = document.getElementById("logs");

socket.on("log-messages", (data) => {
  let messages = "";
  data.forEach((log) => {
    messages += `<p>El usuario ${log.user} dice: ${log.message}</p>`;
  });
  logs.innerHTML = messages;
});
