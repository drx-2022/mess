"use client";
import { useChatContext } from "@/context/chatContext";
import { formatDateBasedOnTime } from "@/utils/dates";
import Image from "next/image";
import React from "react";

interface IRecever {
  messageId: string;
  content: string;
  createdAt: string;
}

function Recever({ messageId, content, createdAt }: IRecever) {
  const { activeChatData } = useChatContext();
  const { photo, name } = activeChatData || {};

  return (
    <div className="mb-2">
      <div className="flex gap-2 md:gap-3">
        <Image
          src={photo}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover self-start border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
        />

        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex items-center gap-3 md:gap-6">
            <h4 className="font-bold text-sm md:text-base text-[#454e56] dark:text-gray-200 truncate max-w-[100px] md:max-w-full">
              {name}
            </h4>
            <p className="pt-[2px] text-[#aaa] text-[10px] md:text-xs">
              {formatDateBasedOnTime(createdAt)}
            </p>
          </div>
          <p
            className="py-[0.25rem] w-full self-start px-3 md:px-4 border-2 rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] md:rounded-tl-[30px] md:rounded-tr-[30px] md:rounded-br-[30px] border-white bg-[#F6F5F9] dark:bg-[#f56693]  
            dark:border-[#f56693] text-[#12181b] dark:text-white shadow-sm text-sm md:text-base"
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Recever;
