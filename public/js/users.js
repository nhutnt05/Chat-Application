// Add Friend 
const listAddFriend = document.querySelectorAll("[btn-add-friend]");

if (listAddFriend.length > 0) {
  listAddFriend.forEach((btn) => {
    btn.addEventListener("click", function () {

      btn.closest(".box-user").classList.add("add");

      const userId = btn.getAttribute("btn-add-friend");

      socket.emit("client_add_friend", userId);
    });
  });
}
// End Add Friend

// Cancel add Friend 
const listCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (listCancelFriend.length > 0) {
  listCancelFriend.forEach((btn) => {
    btn.addEventListener("click", function () {

      btn.closest(".box-user").classList.remove("add");

      const userId = btn.getAttribute("btn-cancel-friend");

      socket.emit("client_cancel_friend", userId);
    });
  });
}
// End Cancel Add Friend

// Refuse add Friend 
const listRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");

if (listRefuseFriend.length > 0) {
  listRefuseFriend.forEach((btn) => {
    btn.addEventListener("click", function () {

      btn.closest(".box-user").classList.add("refuse");

      const userId = btn.getAttribute("btn-refuse-friend");

      socket.emit("client_refuse_friend", userId);
    });
  });
}
// End Refuse Add Friend

// Accept add Friend 
const listAcceptFriend = document.querySelectorAll("[btn-accept-friend]");

if (listAcceptFriend.length > 0) {
  listAcceptFriend.forEach((btn) => {
    btn.addEventListener("click", function () {

      btn.closest(".box-user").classList.add("accepted");

      const userId = btn.getAttribute("btn-accept-friend");

      socket.emit("client_accept_friend", userId);
    });
  });
}
// End Accepted Add Friend

// server_return_length_accept_friend
socket.on("server_return_length_accept_friend", (data) => {
  const badgeLengthAccept = document.querySelector("[badge-accept]");
  const userId = badgeLengthAccept.getAttribute("badge-accept");

  console.log(userId)
  if (data.userId == userId) {
    badgeLengthAccept.innerHTML = data.lengthAcceptFriends;
  }

});
// End server_return_length_accept_friend