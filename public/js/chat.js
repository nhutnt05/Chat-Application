import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// client_send_message
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;

    if (content) {
      // emit: send message
      // SocketIO (Client)
      socket.emit("client_send_message", content);
      e.target.elements.content.value = "";
    }
  });
}
// end client_send_message


// server_return_message(get data from server)
socket.on("server_return_message", (data) => {
  const bodyChat = document.querySelector(".chat .inner-body");
  const my_id = document.querySelector("[my_id]").getAttribute("my_id");

  const div = document.createElement("div");
  let htmlFullName = "";
  if (data.user_id == my_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  // add new message to body chat
  bodyChat.appendChild(div);
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
// End server_return_message


// Scroll to bottom chat body
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  // Scroll way height of body chat
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll to bottom chat body

// emoji-picker
// Show Popup
const buttonEmoji = document.querySelector(".emoji-button");
if (buttonEmoji) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonEmoji, tooltip);

  buttonEmoji.onclick = () => {
    tooltip.classList.toggle('shown');
  }
}

// Insert emojiIcon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputContent = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode; // get the unicode value
    inputContent.value = inputContent.value + icon;
  });
}
// emoji-picker

