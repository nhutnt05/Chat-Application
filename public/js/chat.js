// client_send_message
const formSendData = document.querySelector(".chat .inner-form");

if(formSendData){
  formSendData.addEventListener("submit",  (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;

    if(content){
      // emit: ssend message
      socket.emit("client_send_message",content);
      e.target.elements.content.value= "";
    }
  });
}
// end client_send_message