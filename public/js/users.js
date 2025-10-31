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


  if (data.userId == userId) {
    badgeLengthAccept.innerHTML = data.lengthAcceptFriends;
  }

});
// End server_return_length_accept_friend

// server_return_info_accept_friend
socket.on("server_return_info_accept_friend", (data) => {
  // Page users/accept
  const infoUserAccept = document.querySelector("[data-infoUser-accept]");
  if (infoUserAccept) {
    const userId = infoUserAccept.getAttribute("data-infoUser-accept");

    if (userId == data.userId) {
      // Draw useraccept out interface 
      const newBoxInfo = document.createElement("div");
      newBoxInfo.classList.add("col-6");
      newBoxInfo.setAttribute("user-id", data.infoMyUserId._id);

      newBoxInfo.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="/images/avatar.jpg" alt="${data.infoMyUserId.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name"> 
              ${data.infoMyUserId.fullName}
            </div>
            <div class="inner-buttons">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoMyUserId._id}>
              Xác nhận
            </button><button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoMyUserId._id}>
              Xóa
            </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">
              Đã xóa yêu cầu           
            </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend="" disabled="">
              Đã chấp nhận lời mời...
            </button>
            </div>
          </div>
        </div>
    `;

      infoUserAccept.appendChild(newBoxInfo);
      // End Draw useraccept out interface 

      // Remove accept friend request 
      const buttonRefuseFriend = newBoxInfo.querySelector("[btn-refuse-friend]");
      buttonRefuseFriend.addEventListener("click", () => {
        buttonRefuseFriend.closest(".box-user").classList.add("refuse");

        const userId = buttonRefuseFriend.getAttribute("btn-refuse-friend");

        socket.emit("client_refuse_friend", userId);
      });
      // End Remove friend request 

      // Accept add friend request
      const buttonAcceptFriend = newBoxInfo.querySelector("[btn-accept-friend]");
      buttonAcceptFriend.addEventListener("click", () => {
        buttonAcceptFriend.closest(".box-user").classList.add("accepted");

        const userId = buttonAcceptFriend.getAttribute("btn-accept-friend");
        socket.emit("client_accept_friend", userId);
      });
      // End Accept add friend request


    }
  }
  // End Page users/accept

  // Page users/not-friend
  const userNotFriend = document.querySelector("[users-not-friend]");

  if (userNotFriend) {
    const userId = userNotFriend.getAttribute("users-not-friend");

    if (userId == data.userId) {
      const boxRemoveUser = userNotFriend.querySelector(`[user-id = "${data.infoMyUserId._id}"]`);
      if (boxRemoveUser) {
        userNotFriend.removeChild(boxRemoveUser);
      }

    }
  }
  // End Page users/not-friend

});
// end server_return_info_accept_friend

// server_return_user_id_cancel_friend
socket.on("server_return_user_id_cancel_friend", (data) => {
  const dataUserAccept = document.querySelector("[data-infoUser-accept]");
  const userId = dataUserAccept.getAttribute("data-infoUser-accept");

  if (userId == data.userId) {
    // Remove user cancel request in list accept page
    const userRemove = dataUserAccept.querySelector(`[user-id ="${data.myIdUser}"]`);
    if (userRemove) {
      dataUserAccept.removeChild(userRemove);
    }
  }

});
// End server_return_user_id_cancel_friend

// server_return_accept_no_friend
socket.on("server_return_accept_no_friend", (data) => {
  const boxnotFriend = document.querySelector("[users-not-friend]");
  if (boxnotFriend) {
    const userId = boxnotFriend.getAttribute("users-not-friend");
    if (userId == data.userId) {
      const boxAcceptUser = boxnotFriend.querySelector(`[user-id = "${data.myIdUser}"]`);
      boxnotFriend.removeChild(boxAcceptUser);
    }
  }
});

// End server_return_accept_no_friend

// server_return_user_online
socket.on("server_return_user_online", (userId) => {
  const usersFriend = document.querySelector("[users-friend]");
  if(usersFriend){
    const userOnline = usersFriend.querySelector(`[user-id="${userId}"]`);
    if(userOnline){
      userOnline.querySelector("[status]").setAttribute("status", "online");
    }
  }
});
// End server_return_user_online

// server_return_user_offline
 socket.on("server_return_user_offline", (userId)=> {
  const usersFriend = document.querySelector("[users-friend]");
  if(usersFriend){
    const userOffline = usersFriend.querySelector(`[user-id="${userId}"]`);
    userOffline.querySelector("[status]").setAttribute("status", "offline");
  }
 });
//End  server_return_user_offline