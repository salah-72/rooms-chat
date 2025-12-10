const socket = io();
const messages = document.getElementById("chat-form");
const userslist = document.getElementById("users");
const params = new URLSearchParams(window.location.search);

const username = params.get("username");
const room = params.get("room");

socket.emit("join", { username, room });
socket.on("msg", (data) => {
  addMessage({
    username: "ChatBot",
    message: data.message,
    time: data.time,
  });
});

socket.on("recieve-message", (data) => {
  addMessage({
    username: data.username,
    message: data.message,
    time: data.time,
  });
});

socket.on("roomUsers", ({ room, users }) => {
  document.getElementById("room-name").innerText = room;
  userslist.innerHTML = "";
  users.forEach((element) => {
    const li = document.createElement("li");
    li.innerText = element.username;
    userslist.appendChild(li);
  });
});

function addMessage({ username, message, time }) {
  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">${message}</p>
  `;

  document.querySelector(".chat-messages").appendChild(div);

  div.scrollIntoView({ behavior: "smooth" });
}

messages.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("msg").value;
  document.getElementById("msg").value = "";
  socket.emit("send-message", { username, room, message });
});
