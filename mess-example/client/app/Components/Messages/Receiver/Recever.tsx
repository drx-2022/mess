"use client"
import { useChatContext } from "@/context/chatContext"
import { useEffect, useState } from "react"
import { formatDateBasedOnTime } from "@/utils/dates"
import Image from "next/image"

interface IRecever {
  messageId: string
  content: string
  createdAt: string
  senderId?: string
}

function Recever({ messageId, content, createdAt, senderId }: IRecever) {
  const { activeChatData, getUserById } = useChatContext()
  const { photo, name, isGroup } = activeChatData || {}
  const [senderData, setSenderData] = useState<any>(null)

  useEffect(() => {
    // For group chats, fetch the sender's data
    if (isGroup && senderId) {
      const fetchSenderData = async () => {
        const data = await getUserById(senderId)
        setSenderData(data)
      }

      fetchSenderData()
    }
  }, [isGroup, senderId, getUserById])

  return (
    <div className="mb-2">
      <div className="flex gap-2 sm:gap-3">
        <Image
          src={isGroup && senderData ? senderData.photo : photo || "/placeholder.svg"}
          alt="Profile Picture"
          width={40}
          height={40}
          className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full aspect-square object-cover self-start border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm"
        />

        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-6">
            <h4 className="font-bold text-[#454e56] dark:text-gray-200 text-sm sm:text-base">
              {isGroup && senderData ? senderData.name : name}
            </h4>
            <p className="pt-[2px] text-[#aaa] text-xs">{formatDateBasedOnTime(createdAt)}</p>
          </div>
          <p
            className="py-[0.25rem] max-w-[240px] sm:max-w-[360px] w-full self-start px-3 sm:px-4 border-2 rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] border-white bg-[#F6F5F9] dark:bg-[#f56693]  
            dark:border-[#f56693] text-[#12181b] dark:text-white shadow-sm text-sm sm:text-base"
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}
export default Recever
