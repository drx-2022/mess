"use client";
import useRedirect from "@/hooks/useUserRedirect";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useGlobalContext } from "@/context/globalContext";
import Header from "./Components/Messages/Header/Header";
import Body from "./Components/Messages/Body/Body";
import TextArea from "./Components/Messages/TextArea/TextArea";
import Profile from "./Components/Profile/Profile";
import { useChatContext } from "@/context/chatContext";
import FriendProfile from "./Components/FriendProfile/FriendProfile";
import Online from "./Components/Online/Online";
import MainContent from "./Components/MainContent/MainContent";
import MobileNav from "./Components/MobileNav/MobileNav";
import { useEffect, useState } from "react";

export default function Home() {
  useRedirect("/login");

  const { currentView, showFriendProfile, showProfile } = useGlobalContext();
  const { selectedChat } = useChatContext();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="relative md:px-[5rem] lg:px-[10rem] py-4 md:py-10 h-full">
      <main
        className="h-full flex flex-col md:flex-row backdrop-blur-sm rounded-xl md:rounded-3xl bg-white/65 dark:bg-[#262626]/90 border-2 border-white
        dark:border-[#3C3C3C]/65 shadow-sm overflow-hidden"
      >
        {/* Mobile Navigation - only visible on small screens */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          <div className="relative flex-1 border-r-0 md:border-r-2 border-white dark:border-[#3C3C3C]/60">
            {/* Default Content */}
            {!showProfile && !selectedChat && <MainContent />}

            {!showProfile && selectedChat && <Header />}
            {!showProfile && selectedChat && <Body />}
            <div className="absolute w-full px-4 pb-4 left-0 bottom-0">
              {!showProfile && selectedChat && <TextArea />}
            </div>

            {showProfile && (
              <div className="flex flex-col items-center justify-center h-full">
                <Profile />
              </div>
            )}
          </div>
          
          {/* Online/Friend Profile Section - hidden on mobile unless explicitly shown */}
          <div className="hidden md:block md:w-[30%] lg:w-[30%]">
            {!showFriendProfile && <Online />}
            {showFriendProfile && <FriendProfile />}
          </div>
        </div>
      </main>
    </div>
  );
}
