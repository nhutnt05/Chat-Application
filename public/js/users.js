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
      const buttonRefuseFriend = newBoxInfo.querySelector(
        "[btn-refuse-friend]"
      );
      buttonRefuseFriend.addEventListener("click", () => {
        buttonRefuseFriend.closest(".box-user").classList.add("refuse");

        const userId = buttonRefuseFriend.getAttribute("btn-refuse-friend");

        socket.emit("client_refuse_friend", userId);
      });
      // End Remove friend request

      // Accept add friend request
      const buttonAcceptFriend = newBoxInfo.querySelector(
        "[btn-accept-friend]"
      );
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
      const boxRemoveUser = userNotFriend.querySelector(
        `[user-id = "${data.infoMyUserId._id}"]`
      );
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
    const userRemove = dataUserAccept.querySelector(
      `[user-id ="${data.myIdUser}"]`
    );
    if (userRemove) {
      dataUserAccept.removeChild(userRemove);
    }
  }
});
// End server_return_user_id_cancel_friend

// server_return_accept_friend
socket.on("server_return_accept_friend", (data) => {
  const boxnotFriend = document.querySelector("[users-not-friend]");
  if (boxnotFriend) {
    const userId = boxnotFriend.getAttribute("users-not-friend");
    if (userId == data.userId) {
      const boxAcceptUser = boxnotFriend.querySelector(
        `[user-id = "${data.myIdUser}"]`
      );
      boxnotFriend.removeChild(boxAcceptUser);
    }
  }
});
// End server_return_accept_friend

// server_return_user_online
socket.on("server_return_user_online", (userId) => {
  const usersFriend = document.querySelector("[users-friend]");
  if (usersFriend) {
    const userOnline = usersFriend.querySelector(`[user-id="${userId}"]`);
    if (userOnline) {
      userOnline.querySelector("[status]").setAttribute("status", "online");
    }
  }

  // Online in roomChat
  const userItem = document.querySelector(
    `[users-room-chat] .user-item[user-id="${userId}"]`
  );
  if (userItem) {
    const statusDot = userItem.querySelector(".status-dot");
    if (statusDot) {
      statusDot.classList.remove("status-offline");
      statusDot.classList.add("status-online");
    }
  }
});
// End server_return_user_online

// server_return_user_offline
socket.on("server_return_user_offline", (userId) => {
  const usersFriend = document.querySelector("[users-friend]");
  if (usersFriend) {
    const userOffline = usersFriend.querySelector(`[user-id="${userId}"]`);
    userOffline.querySelector("[status]").setAttribute("status", "offline");
  }

  // Offline in roomChat
  const userItem = document.querySelector(
    `[users-room-chat] .user-item[user-id="${userId}"]`
  );
  if (userItem) {
    const statusDot = userItem.querySelector(".status-dot");
    if (statusDot) {
      statusDot.classList.remove("status-online");
      statusDot.classList.add("status-offline");
    }
  }
});
//End  server_return_user_offline

// Unfriend
document.querySelectorAll(".inner-ellipsis").forEach((el) => {
  const icon = el.querySelector("i");
  const box = el.querySelector(".inner-remove");

  // Toggle dropdown khi click icon
  icon.addEventListener("click", (e) => {
    e.stopPropagation();
    box.classList.toggle("show");
  });

  // Click outside dropdown để ẩn
  document.addEventListener("click", (e) => {
    if (!el.contains(e.target)) {
      box.classList.remove("show");
    }
  });

  // Click Unfriend
  box.addEventListener("click", () => {
    const unfriend = box.dataset.fullName || box.getAttribute("fullName");
    const userId = box.closest(".col-6").getAttribute("user-id");
    const BoxMess = document.querySelector;
    if (!unfriend) return;

    // Show popup
    Swal.fire({
      title: `Hủy kết bạn với ${unfriend}?`,
      text: `Bạn có chắc chắn muốn hủy kết bạn với ${unfriend} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("client_unfriend_server", userId);

        // Hidden dropdown
        // box.classList.remove('show');

        // Display success message
        Swal.fire({
          title: "Đã hủy kết bạn!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  });
});

socket.on("server_return_unfriend_id", (idUser) => {
  const boxFriend = document.querySelector("[users-friend]");
  if (boxFriend) {
    const user = boxFriend.querySelector(`[user-id="${idUser}"]`);
    const boxMess = user.querySelector(".box-user");
    if (boxMess) {
      boxMess.classList.remove("mess");
    }
  }
});

// End Unfriend