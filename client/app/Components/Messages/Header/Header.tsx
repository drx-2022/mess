import { useChatContext } from "@/context/chatContext";
import { useGlobalContext } from "@/context/globalContext";
import { IUser } from "@/types/type";
import { dots, searchIcon } from "@/utils/Icons";
import { formatDateLastSeen } from "@/utils/dates";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GroupManageModal from "@/app/Components/Messages/GroupManageModal"; // Adjust path if needed
import { useUserContext } from "@/context/userContext";

function Header() {
  const [showGroupManage, setShowGroupManage] = useState(false);
  const { activeChatData, onlineUsers, socket, setOnlineUsers } = useChatContext();
  const { user, allUsers } = useUserContext();
  const isGroup = activeChatData?.isGroup;
  const isAdmin = isGroup && user && activeChatData?.groupAdmin === user._id;
  const groupMembers = activeChatData?.participantsData || [];
  const { handleFriendProfile, showFriendProfile } = useGlobalContext();

  const { photo, lastSeen } = activeChatData || {};

  // check if active chat user is online
  const isOnline = onlineUsers?.find(
    (user: IUser) => user?._id === activeChatData?._id
  );

  useEffect(() => {
    socket?.on("user disconnected", (updatedUser: IUser) => {
      // update the online users state
      setOnlineUsers((prev: IUser[]) => {
        prev.filter((user: IUser) => user._id !== updatedUser._id);
      });

      // if the user is disconnected, update their last seen status
      if (activeChatData?._id === updatedUser._id) {
        activeChatData.lastSeen = updatedUser.lastSeen;
      }
    });

    //cleanup
    return () => {
      socket?.off("user disconnected");
    };
  }, [socket, activeChatData, setOnlineUsers]);

  return (
    <div className="p-2 md:p-4 flex justify-between border-b-2 border-white dark:border-[#3C3C3C]/60">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => handleFriendProfile(!showFriendProfile)}
      >
        <Image
          src={photo}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer
          hover:scale-105 transition-transform duration-300 ease-in-out md:w-[50px] md:h-[50px]"
        />

        <div className="flex flex-col">
          <h2 className="font-bold text-lg md:text-xl text-[#454e56] dark:text-white truncate max-w-[150px] md:max-w-full">
            {activeChatData?.name}
            {isGroup && isAdmin && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-[#7263f3] text-white rounded">Admin</span>
            )}
          </h2>
          <p className="text-xs text-[#aaa]">
            {isGroup
              ? `${groupMembers.length} members${isAdmin ? " • You are admin" : ""}`
              : isOnline
                ? "Online"
                : formatDateLastSeen(lastSeen)}
          </p>
        </div>
      </div>
      <div></div>
      <div className="flex items-center gap-3 md:gap-6 text-[#454e56] text-lg md:text-xl">
        {isGroup && isAdmin && (
          <button
            className="p-1"
            title="Manage Group"
            onClick={() => setShowGroupManage(true)}
          >
            {dots}
          </button>
        )}
        {isGroup && (
          <GroupManageModal
            isOpen={showGroupManage}
            onClose={() => setShowGroupManage(false)}
            group={activeChatData}
            currentUser={user}
            users={allUsers || []}
          />
        )}
        <button className="p-1">{searchIcon}</button>
        {!isGroup && <button className="p-1">{dots}</button>}
      </div>
    </div>
  );
}

export default Header;
