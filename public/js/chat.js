import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// import { set } from 'mongoose';

// FileUploadWithPreview
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

const upload = new FileUploadWithPreview('upload-image', {
  multiple: true,
  maxFileCount: 10
});
// End FileUploadWithPreview


// client_send_message
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;

    // All imgae save cash file array
    const images = upload.cachedFileArray || [];


    if (content || images.length > 0) {
      // emit: send message, images to server
      // SocketIO (Client)
      socket.emit("client_send_message",
        {
          content: content,
          images: images
        }
      );
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      // Hidden typing when send message
      socket.emit("client_send_typing", "hidden");
    }
  });
}
// end client_send_message


// server_return_message(get data from server)
socket.on("server_return_message", (data) => {
  const bodyChat = document.querySelector(".chat .inner-body");
  const my_id = document.querySelector("[my_id]").getAttribute("my_id");

  const boxTyping = document.querySelector(".inner-list-typing");

  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (data.user_id == my_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  if (data.images.length > 0) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>;
    `
  }

  if (data.content) {
    htmlImages += ` <div class="inner-images">`;

    for(item of data.images){
      htmlImages+= `<img src="${item}" alt="image_chat"/>`;
    }

    htmlImages+= `</div>`;   
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  // add new message to body chat && message before box typing
  bodyChat.insertBefore(div, boxTyping);
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

// Show Typing ... when typing
var timeOut;
const showTyping = () => {

  socket.emit("client_send_typing", "show");

  clearTimeout(timeOut);
  // After 3 seconds not typing, send hiden
  timeOut = setTimeout(() => {
    socket.emit("client_send_typing", "hidden");
  }, 5000);
}
// End Show Typing ... when typing


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
  const inputContent = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode; // get the unicode value
    inputContent.value = inputContent.value + icon;

    // Alway index end input after insert emoji
    const indexEnd = inputContent.value.length;
    inputContent.setSelectonRange(indexEnd, indexEnd);
    inputContent.focus();

    showTyping();
  });

  // Show typing when keyup input
  inputContent.addEventListener('keyup', () => {
    showTyping();
  });
}
// end emoji-picker

// server_return_typing
const listTyping = document.querySelector(".chat .inner-list-typing");
if (listTyping) {
  socket.on("server_return_typing", (data) => {
    if (data.type == "show") {
      const exitsBoxTyping = listTyping.querySelector(`[user_id="${data.user_id}"]`);

      if (!exitsBoxTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");

        const divBoxTyping = document.createElement("div");
        divBoxTyping.classList.add("box-typing");
        divBoxTyping.setAttribute("user_id", data.user_id);
        divBoxTyping.innerHTML = `
            <div class="inner-name">${data.fullName}</div>
            <div class="inner-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
        `;
        listTyping.appendChild(divBoxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const exitsBoxTypingRemove = listTyping.querySelector(`[user_id="${data.user_id}"]`);
      if (exitsBoxTypingRemove) {
        listTyping.removeChild(exitsBoxTypingRemove);
      }
    }

  });
}

// end server_return_typing

