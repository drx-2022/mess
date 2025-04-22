"use client"
import useRedirect from "@/hooks/useUserRedirect"
import Sidebar from "./Components/Sidebar/Sidebar"
import { useGlobalContext } from "@/context/globalContext"
import Header from "./Components/Messages/Header/Header"
import Body from "./Components/Messages/Body/Body"
import TextArea from "./Components/Messages/TextArea/TextArea"
import Profile from "./Components/Profile/Profile"
import { useChatContext } from "@/context/chatContext"
import FriendProfile from "./Components/FriendProfile/FriendProfile"
import GroupInfo from "./Components/GroupInfo/GroupInfo"
import Online from "./Components/Online/Online"
import MainContent from "./Components/MainContent/MainContent"
import MobileNav from "./Components/MobileNav/MobileNav"

export default function Home() {
  useRedirect("/login")

  const { currentView, showFriendProfile, showProfile } = useGlobalContext()
  const { selectedChat, activeChatData } = useChatContext()

  return (
    <div className="relative px-2 sm:px-4 md:px-8 lg:px-[10rem] py-2 sm:py-4 md:py-6 lg:py-10 h-full">
      <main
        className="h-full flex flex-col md:flex-row backdrop-blur-sm rounded-xl md:rounded-3xl bg-white/65 dark:bg-[#262626]/90 border-2 border-white
        dark:border-[#3C3C3C]/65 shadow-sm overflow-hidden"
      >
        {/* Mobile Navigation - only visible on small screens */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Sidebar - hidden on mobile unless toggled */}
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col md:flex-row h-full">
          <div className="relative flex-1 border-r-0 md:border-r-2 border-white dark:border-[#3C3C3C]/60 h-full">
            {/* Default Content */}
            {!showProfile && !selectedChat && <MainContent />}

            {!showProfile && selectedChat && <Header />}
            {!showProfile && selectedChat && <Body />}
            <div className="absolute w-full px-4 pb-4 left-0 bottom-0">
              {!showProfile && selectedChat && <TextArea />}
            </div>

            {showProfile && (
              <div className="flex flex-col items-center justify-center h-full overflow-y-auto">
                <Profile />
              </div>
            )}
          </div>

          {/* Online users and profiles - hidden on mobile by default */}
          <div className="hidden md:block w-full md:w-[30%] h-full">
            {!showFriendProfile && <Online />}
            {showFriendProfile && activeChatData?.isGroup ? <GroupInfo /> : showFriendProfile && <FriendProfile />}
          </div>
        </div>
      </main>
    </div>
  )
}
