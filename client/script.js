document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect("http://localhost:3000");

  let username = prompt("Enter your name");
if (username) {
  socket.emit("join", username);
  const welcomeUser = document.getElementById("welcoming-user");
  welcomeUser.innerHTML = ` <span id="status-dot" class="mx-1"></span> Welcome ${username} `;
} else {
  username = prompt("Please Enter your name to Chat");
  if (username) {
    socket.emit("join", username);
    const welcomeUser = document.getElementById("welcoming-user");
    welcomeUser.innerHTML = `<span id="status-dot" class="mx-1"></span> Welcome ${username} `;
  } else {
    // Handle the case where the user cancels the prompt again
    // For now, you can just reload the page or show an error message
    location.reload();
  }
}
 // Update connected users list
 socket.on("update_users", (users) => {
  const connectedUsersList = document.getElementById("connected-users");
  const usersList = connectedUsersList.querySelector(".list-group");
  usersList.innerHTML = ` <button
  type="button"
  class="list-group-item list-group-item active">
  Connected Users: ${users.length}
</button>`;
  
  users.forEach(user => {
    const listItem = document.createElement("button");
    listItem.style.backgroundColor = "#d8edc2"
    listItem.className = "list-group-item ";
    listItem.innerHTML = `<span id="status-dot" class="mx-1"></span>${user}`;
    usersList.appendChild(listItem);
  });
});

  const msgInput = document.getElementById("message-input");
  const msgContainer = document.getElementById("chat-messages");
  const msgSend = document.getElementById("send-button");
  const sendSound = document.getElementById("sendSound");

  msgSend.addEventListener("click", function () {
    const message = msgInput.value;
    if (message) {
      socket.emit("new_message", message); // Emitting the message to the server
      sendSound.play();

      // add message to the list
      const msgElement = document.createElement("div");
      msgElement.innerHTML = `   
      <div id="user" class="message-container user-message-container">
          <div class="message user-message">
              <a href="" id="username">${username}</a>
              <small id="timestamp">${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</small>
              <div class="message-text">${message}</div>   
          </div>
          <img id="user-profile" src="./images/spiderman.png" alt="">
      </div>`;
      msgContainer.appendChild(msgElement);
      //  Reset the value of textbox to empty
      msgInput.value = "";
    }
  });
  msgInput.addEventListener("keydown", function () {
    socket.emit("typing");
});
msgInput.addEventListener("keyup", function () {
  socket.emit("stop_typing");
});
socket.on("typing", (username) => {
  const welcomingUser = document.getElementById("welcoming-user");
  welcomingUser.innerHTML = ` <em> ${username} is typing... <em>`;
});
socket.on("stop_typing", () => {
  const welcomingUser = document.getElementById("welcoming-user");
  welcomingUser.innerHTML = `<span id="status-dot" class="mx-1"></span> Welcome ${username}`;
});
  const broadcastImages = [
    "./images/batman.png",
    "./images/dinosaur.png",
    "./images/koala.png",
    "./images/ninja.png",
    "./images/superhero.png"
  ];
  // Display messages on UI
  socket.on("load_messages", (messages) => {
    messages.forEach(message => {
      const messageElement = document.createElement("div");
      const randomImage = broadcastImages[Math.floor(Math.random() * broadcastImages.length)];
      messageElement.innerHTML = `
      <div class="message-container broadcast-message-container">
      <img id="user-profile" src="${randomImage}" alt="">
          <div class="message broadcast-message">
              <a href="" id="username">${message.username}</a>
              <small id="timestamp">${new Date(message.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</small>
              <div class="message-text">${message.message}</div>
          </div>
      </div>`;
      msgContainer.appendChild(messageElement);
    });
  });
  
  socket.on("broadcast_message", (userMessage) => {
    const messageElement = document.createElement("div");
    console.log(userMessage);
    // Randomly select an image from the broadcastImages array
  const randomImage = broadcastImages[Math.floor(Math.random() * broadcastImages.length)];
    messageElement.innerHTML = `
      <div class="message-container broadcast-message-container">
      <img id="user-profile" src="${randomImage}" alt="">
          <div class="message broadcast-message">
              <a href="" id="username">${userMessage.username}</a>
              <small id="timestamp">${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</small>
              <div class="message-text">${userMessage.message}</div>
          </div>
      </div>`;
    msgContainer.appendChild(messageElement);
  });
  
});