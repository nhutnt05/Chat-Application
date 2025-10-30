// Add Friend 
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");

if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((btn) => {
    btn.addEventListener("click", function () {

      btn.closest(".box-user").classList.add("add");

      const userId = btn.getAttribute("btn-add-friend");

      socket.emit("client_add_friend", userId);
    });
  });
}
// End Add Friend

// Cancel add Friend 
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((btn) => {
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