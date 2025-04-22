"use client"
import { useChatContext } from "@/context/chatContext"
import { useGlobalContext } from "@/context/globalContext"
import { useUserContext } from "@/context/userContext"
import { inbox, users } from "@/utils/Icons"
import Image from "next/image"
import { useState } from "react"
import MobileSidebar from "../MobileSidebar/MobileSidebar"

function MobileNav() {
  const { user } = useUserContext()
  const { showProfile, handleProfileToggle, handleViewChange, currentView } = useGlobalContext()
  const { selectedChat, setShowCreateGroup } = useChatContext()
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

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
          {/* Create group button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3C3C3C]/30 text-[#454e56] dark:text-white/65"
          >
            {users}
          </button>

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
      {showMobileSidebar && <MobileSidebar onClose={() => setShowMobileSidebar(false)} />}
    </>
  )
}

export default MobileNav
