"use cleint"
import { useUserContext } from "@/context/userContext"
import { formatDateBasedOnTime } from "@/utils/dates"
import Image from "next/image"

interface ISender {
  content: string
  createdAt: string
  status: string
}

function Sender({ content, createdAt, status }: ISender) {
  const { user } = useUserContext()

  const { photo } = user || {}
  return (
    <div className="mb-2">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-6">
            <h4 className="font-bold text-[#454e56] dark:text-white/60 text-sm sm:text-base">You</h4>
            <p className="pt-[2px] text-[#aaa] text-xs">{formatDateBasedOnTime(createdAt)}</p>
          </div>
          <p className="py-[0.25rem] max-w-[240px] sm:max-w-[360px] w-full self-start px-3 sm:px-4 rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] border-[#7263f3] bg-[#7263f3] text-white shadow-sm text-sm sm:text-base">
            {content}
          </p>
        </div>
        <Image
          src={photo || "/placeholder.svg"}
          alt="Profile Picture"
          width={40}
          height={40}
          className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full aspect-square object-cover self-start border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm"
        />
      </div>
    </div>
  )
}

export default Sender
