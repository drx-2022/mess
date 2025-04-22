"use client"
import { useChatContext } from "@/context/chatContext"
import { useGlobalContext } from "@/context/globalContext"
import { useUserContext } from "@/context/userContext"
import { archive, chat, database, group, xMark } from "@/utils/Icons"
import { gradientText } from "@/utils/TaiwindStyles"
import React, { useState } from "react"
import ChatItem from "../ChatItem/ChatItem"
import FriendRequests from "../FriendRequests/FriendRequests"
import SearchInput from "../SearchInput/SearchInput"
import SearchResults from "../SearchResults/SearchResults"
import type { IChat, IUser } from "@/types/type"

interface MobileSidebarProps {
  onClose: () => void
}

function MobileSidebar({ onClose }: MobileSidebarProps) {
  const { user, searchResults } = useUserContext()
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext()
  const { showProfile, handleProfileToggle, handleViewChange, currentView } = useGlobalContext()
  const { friendRequests } = user

  const [activeView, setActiveView] = useState(currentView)

  const handleNavClick = (view: string) => {
    setActiveView(view)
    handleViewChange(view)
  }

  const handleChatSelect = (chat: IChat) => {
    handleSelectedChat(chat)
    handleProfileToggle(false)
    onClose() // Close sidebar after selecting a chat
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="h-full w-[85%] max-w-[320px] bg-white dark:bg-[#262626] overflow-y-auto animate-slide-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#3C3C3C]/60">
          <h2 className={`font-bold text-xl ${gradientText} dark:text-white`}>Messages</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            {xMark}
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex border-b border-gray-200 dark:border-[#3C3C3C]/60">
          <button
            className={`flex-1 py-3 text-center ${activeView === "all-chats" ? "border-b-2 border-[#7263f3]" : ""}`}
            onClick={() => handleNavClick("all-chats")}
          >
            <span className="inline-block">{chat}</span>
            <span className="block text-xs mt-1">Chats</span>
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeView === "archived" ? "border-b-2 border-[#7263f3]" : ""}`}
            onClick={() => handleNavClick("archived")}
          >
            <span className="inline-block">{archive}</span>
            <span className="block text-xs mt-1">Archived</span>
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeView === "requests" ? "border-b-2 border-[#7263f3]" : ""} relative`}
            onClick={() => handleNavClick("requests")}
          >
            <span className="inline-block">{group}</span>
            <span className="block text-xs mt-1">Requests</span>
            {friendRequests?.length > 0 && (
              <span className="absolute top-1 right-1/4 w-4 h-4 bg-[#f00] text-white text-xs rounded-full flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-4">
          <SearchInput />
        </div>

        {searchResults?.data?.length > 0 && (
          <div className="mt-2">
            <h4 className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}>
              {database} Search Results
            </h4>
            <SearchResults />
          </div>
        )}

        {activeView === "all-chats" && (
          <div className="mt-4">
            <h4 className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}>
              {chat}
              <span>All Chats</span>
            </h4>

            <div className="mt-2">
              {allChatsData.map((chat: IChat) => {
                if (chat.isGroup) {
                  // Render group chat item
                  return (
                    <ChatItem
                      key={chat._id}
                      user={{
                        _id: chat._id,
                        name: chat.groupName || "Group Chat",
                        photo: chat.groupPhoto || "https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg",
                        isGroup: true,
                      }}
                      active={!showProfile && selectedChat?._id === chat._id}
                      chatId={chat._id}
                      onClick={() => handleChatSelect(chat)}
                    />
                  )
                } else {
                  // Render direct chat items
                  return (
                    <React.Fragment key={chat._id}>
                      {chat?.participantsData?.map((participant: IUser) => {
                        return (
                          <ChatItem
                            key={participant._id}
                            user={participant}
                            active={!showProfile && selectedChat?._id === chat._id}
                            chatId={chat._id}
                            onClick={() => handleChatSelect(chat)}
                          />
                        )
                      })}
                    </React.Fragment>
                  )
                }
              })}
            </div>
          </div>
        )}

        {activeView === "archived" && (
          <div className="mt-4">
            <h4 className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}>
              <span>{archive}</span> <span>Archived</span>
            </h4>
            <div className="mt-2">
              <p className="px-4 py-2 text-[#454e56] dark:text-white/65">No archived chats</p>
            </div>
          </div>
        )}

        {activeView === "requests" && (
          <div className="mt-4">
            <h4 className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}>
              <span className="w-[20px]">{group}</span>
              <span>Friend Requests</span>
            </h4>

            <div className="mt-2">
              {friendRequests?.length > 0 ? (
                <FriendRequests />
              ) : (
                <p className="px-4 py-2 text-[#454e56] dark:text-white/65">There are no friend requests</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileSidebar
