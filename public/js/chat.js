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
    <div class="inner-contet">${data.content}</div>
  `;

  // add new message to body chat
  bodyChat.appendChild(div);
});
// End server_return_message