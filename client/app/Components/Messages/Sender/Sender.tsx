"use cleint";
import { useUserContext } from "@/context/userContext";
import { formatDateBasedOnTime } from "@/utils/dates";
import Image from "next/image";
import React from "react";

interface ISender {
  content: string;
  createdAt: string;
  status: string;
}

function Sender({ content, createdAt, status }: ISender) {
  const { user } = useUserContext();

  const { photo } = user || {};
  return (
    <div className="mb-2">
      <div className="flex gap-2 md:gap-3">
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex items-center gap-3 md:gap-6">
            <h4 className="font-bold text-sm md:text-base text-[#454e56] dark:text-white/60">You</h4>
            <p className="pt-[2px] text-[#aaa] text-[10px] md:text-xs">
              {formatDateBasedOnTime(createdAt)}
            </p>
          </div>
          <p className="py-[0.25rem] w-full self-start px-3 md:px-4 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] md:rounded-tr-[30px] md:rounded-br-[30px] md:rounded-bl-[30px] border-[#7263f3] bg-[#7263f3] text-white shadow-sm text-sm md:text-base">
            {content}
          </p>
        </div>
        <Image
          src={photo}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover self-start border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
        />
      </div>
    </div>
  );
}

export default Sender;
