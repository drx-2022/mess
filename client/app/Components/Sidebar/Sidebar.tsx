"use client";
import { useUserContext } from "@/context/userContext";
import {
  archive,
  chat,
  database,
  group,
  inbox,
  moon,
  sun,
} from "@/utils/Icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GroupChatCreate from "../GroupChatCreate";
import { gradientText } from "@/utils/TaiwindStyles";
import { useGlobalContext } from "@/context/globalContext";
import SearchInput from "../SearchInput/SearchInput";
import { useChatContext } from "@/context/chatContext";
import ChatItem from "../ChatItem/ChatItem";
import { IChat, IUser } from "@/types/type";
import SearchResults from "../SearchResults/SearchResults";
import FriendRequests from "../FriendRequests/FriendRequests";

const navButtons = [
  {
    id: 0,
    name: "All Chats",
    icon: inbox,
    slug: "all-chats",
  },
  {
    id: 1,
    name: "Archived",
    icon: archive,
    slug: "archived",
  },
  {
    id: 2,
    name: "Requests",
    icon: group,
    slug: "requests",
    notification: true,
  },
];

function Sidebar() {
  const { user, updateUser, searchResults } = useUserContext();
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const {
    showProfile,
    handleProfileToggle,
    handleFriendProfile,
    handleViewChange,
    currentView,
  } = useGlobalContext();
  const { photo, friendRequests } = user;

  // active nav button - initialize based on current view
  const [activeNav, setActiveNav] = useState(() => {
    // Find the button that matches the current view
    const activeButton = navButtons.find(btn => btn.slug === currentView);
    return activeButton ? activeButton.id : navButtons[0].id;
  });

  const lightTheme = () => {
    updateUser({ theme: "light" });
  };

  const darkTheme = () => {
    updateUser({ theme: "dark" });
  };

  useEffect(() => {
    document.documentElement.className = user.theme;
  }, [user.theme]);
  
  // Update activeNav when currentView changes
  useEffect(() => {
    const activeButton = navButtons.find(btn => btn.slug === currentView);
    if (activeButton) {
      setActiveNav(activeButton.id);
    }
  }, [currentView]);

  return (
    <div className="w-full md:w-[22rem] lg:w-[25rem] flex border-r-2 border-white dark:border-[#3C3C3C]/60">
      <div className="p-3 md:p-4 flex flex-col justify-between items-center border-r-2 border-white dark:border-[#3C3C3C]/60">
        <div
          className="profile flex flex-col items-center"
          onClick={() => {
            handleProfileToggle(true);
          }}
        >
          <Image
            src={photo}
            alt="profile"
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover border-2 border-white dark:border-[#3C3C3C]/65
                cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text
                w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
          />
        </div>
        <div className="w-full relative py-3 md:py-4 flex flex-col items-center gap-6 md:gap-8 text-[#454e56] text-base md:text-lg border-2 border-white dark:border-[#3C3C3C]/65 rounded-[20px] md:rounded-[30px] shadow-sm">
          {navButtons.map((btn) => {
            return (
              <button
                key={btn.id}
                className={`${
                  activeNav === btn.id ? `active-nav dark:${gradientText}` : ""
                } relative p-1 flex items-center text-[#454e56] dark:text-white/65`}
                onClick={() => {
                  setActiveNav(btn.id);
                  handleViewChange(btn.slug);
                  handleProfileToggle(false);
                }}
              >
                {btn.icon}

                {btn.notification && (
                  <span className=" absolute -top-2 right-0 w-4 h-4 bg-[#f00] text-white text-xs rounded-full flex items-center justify-center">
                    {friendRequests?.length > 0 ? friendRequests.length : "0"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-2 text-[#454e56] text-xl flex flex-col gap-2 border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px] shadow-sm dark:text-white/65">
          <button
            className={`${
              user?.theme === "light"
                ? `inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#7263f3] to-[#f56693]`
                : ""
            }`}
            onClick={() => lightTheme()}
          >
            {sun}
          </button>
          <span className="w-full h-[2px] bg-white dark:bg-[#3C3C3C]/60"></span>
          <button
            className={`${user?.theme === "dark" ? "text-white" : ""}`}
            onClick={() => darkTheme()}
          >
            {moon}
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 md:p-4 overflow-y-auto">
        <div className="flex items-center">
          <h2 className={`font-bold text-lg md:text-xl ${gradientText} dark:text-white`}>
            Messages
          </h2>
        </div>
        <div className="mt-3 md:mt-4">
          <SearchInput />
        </div>

        {searchResults?.data?.length > 0 && (
          <div className="mt-4">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              {database} Search Results
            </h4>
            <SearchResults />
          </div>
        )}

        {/* Content container with fixed height to prevent layout shift */}
        <div className="mt-8 min-h-[400px]">
          {/* Section headers - always visible regardless of current view */}
          <div className="flex items-center justify-between px-4">
            <h4
              className={`grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200 ${currentView === "all-chats" ? "" : "opacity-50"}`}
            >
              {chat}
              <span>All Chats</span>
            </h4>
            <button
              className="ml-2 px-3 py-1 rounded bg-[#7263f3] text-white text-sm hover:bg-[#5a4edc]"
              onClick={() => setShowGroupModal(true)}
              title="Create Group Chat"
              style={{ visibility: currentView === "all-chats" ? "visible" : "hidden" }}
            >
              + Group
            </button>
          </div>
          
          {/* All Chats View Content */}
          {currentView === "all-chats" && (
            <>
              <div className="mt-2">
                {allChatsData.map((chat: IChat) => {
                  if (chat.isGroup) {
                    // Render group chat as a single item
                    return (
                      <div
                        key={chat._id}
                        className={`px-4 py-3 flex gap-2 items-center border-b-2 border-white dark:border-[#3C3C3C]/65 cursor-pointer ${
                          !showProfile && selectedChat?._id === chat._id ? "bg-blue-100 dark:bg-white/5" : ""
                        }`}
                        onClick={() => {
                          handleProfileToggle(false);
                          handleSelectedChat(chat);
                        }}
                      >
                        <div className="relative inline-block">
                          <img
                            src={chat.participantsData?.[0]?.photo || "/logo.png"}
                            alt={chat.name || "Group"}
                            width={50}
                            height={50}
                            className="rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{chat.name}</h4>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[#aaa]">
                              Group Chat ({chat.participants?.length} members)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  // Render direct (1:1) chats as before
                  return (
                    <React.Fragment key={chat._id}>
                      {chat?.participantsData?.map((participant: IUser) => {
                        return (
                          <ChatItem
                            key={participant._id}
                            user={participant}
                            active={
                              !showProfile && selectedChat?._id === chat._id
                            }
                            chatId={chat._id}
                            onClick={() => {
                              handleProfileToggle(false);
                              handleSelectedChat(chat);
                            }}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              {showGroupModal && (
                <GroupChatCreate
                  users={user.friendsData || []}
                  onClose={() => setShowGroupModal(false)}
                  onCreated={() => setShowGroupModal(false)}
                />
              )}
            </>
          )}

          {/* Archived View Content */}
          {currentView === "archived" && (
            <>
              <div className="mt-2">
                <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                  No archived chats
                </p>
              </div>
            </>
          )}

          {/* Requests View Content */}
          {currentView === "requests" && (
            <>
              <div className="mt-2">
                {friendRequests?.length > 0 ? (
                  <FriendRequests />
                ) : (
                  <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                    There are no friend requests
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
