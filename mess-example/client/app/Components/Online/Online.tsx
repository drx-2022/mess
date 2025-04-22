"use client"
import { useChatContext } from "@/context/chatContext"
import type { IChat, IUser } from "@/types/type"
import { gradientText } from "@/utils/TaiwindStyles"
import Image from "next/image"

function Online() {
  const { onlineUsers, handleSelectedChat, allChatsData } = useChatContext()

  const getChat = (id: string) => {
    const chat = allChatsData.find((chat: IChat) => chat.participants.includes(id))

    if (chat) {
      handleSelectedChat(chat)
    }
  }

  return (
    <div className="h-full relative pt-4 pb-4 flex-1 overflow-hidden">
      <h2 className={`px-4 mt-2 font-bold text-xl sm:text-2xl ${gradientText} dark:text-white`}>Online Friends</h2>

      <p className={`px-4 mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300`}>
        {onlineUsers?.length} {onlineUsers?.length === 1 ? "Friend" : "Friends"} Online
      </p>

      <div className="mt-2 mx-4">
        {onlineUsers?.map((user: IUser) => {
          return (
            <div
              key={user?._id}
              className={`mb-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[50px] border-2 border-white flex gap-2 items-center bg-blue-50 dark:border-[#3C3C3C]/65 cursor-pointer
                hover:bg-blue-100 dark:bg-white/5 transition-colors duration-300 ease-in-out
              `}
              onClick={() => getChat(user._id)}
            >
              <div className="relative inline-block">
                <Image
                  src={user?.photo || "/placeholder.svg"}
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
                  alt="profile"
                />
                <div className="absolute bottom-0 right-0 w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-sm sm:text-base">{user?.name}</h2>
                  <p className={`text-xs font-medium ${gradientText} dark:text-white`}>
                    Online <span className="text-green-500">•</span>
                  </p>
                </div>
                <div className="flex justify-between items-center"></div>
              </div>
            </div>
          )
        })}
      </div>

      {onlineUsers?.length > 7 && (
        <div className="h-[300px] w-full absolute bottom-0 bg-gradient-to-t from-[#fff] to-transparent dark:from-[#000000]/50 dark:to-[#00000000] pointer-events-none"></div>
      )}
    </div>
  )
}

export default Online
