"use client"
import { useChatContext } from "@/context/chatContext"
import { useGlobalContext } from "@/context/globalContext"
import { useUserContext } from "@/context/userContext"
import { inbox, group } from "@/utils/Icons"
import Image from "next/image"
import { useState } from "react"
import MobileSidebar from "../MobileSidebar/MobileSidebar"
import GroupChatCreate from "../GroupChatCreate"

function MobileNav() {
  const { user, searchResults } = useUserContext()
  const { showProfile, handleProfileToggle } = useGlobalContext()
  const { selectedChat, handleSelectedChat } = useChatContext()
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-[#3C3C3C]/60">
        <div className="flex items-center gap-2">
          {/* Toggle sidebar button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3C3C3C]/30"
          >
            {inbox}
          </button>

          <h1 className="text-lg font-bold text-[#454e56] dark:text-white">
            {selectedChat ? (selectedChat.isGroup ? selectedChat.groupName : "Chat") : "ChatApp"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile button */}
          <button onClick={() => handleProfileToggle(!showProfile)}>
            <Image
              src={user?.photo || "/placeholder.svg?height=40&width=40"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full aspect-square object-cover border-2 border-white dark:border-[#3C3C3C]/65"
            />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <MobileSidebar 
          onClose={() => setShowMobileSidebar(false)} 
          onCreateGroup={() => {
            setShowMobileSidebar(false);
            setShowGroupModal(true);
          }}
        />
      )}
      
      {/* Group Chat Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowGroupModal(false)}></div>
          <div className="relative z-10 w-full max-w-md mx-auto">
            <GroupChatCreate 
              users={searchResults.length > 0 ? searchResults : (user?.friendsData || [])}
              onClose={() => setShowGroupModal(false)}
              onCreated={(group) => {
                handleSelectedChat(group);
                setShowGroupModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNav
