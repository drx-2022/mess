import { lock } from "@/utils/Icons";
import { gradientText } from "@/utils/TaiwindStyles";
import Image from "next/image";
import React from "react";

function MainContent() {
  return (
    <div className="h-full flex flex-col justify-center items-center p-4 md:p-6">
      <div className="mt-auto flex flex-col gap-3 md:gap-4">
        <div className="flex justify-center items-center">
          <Image
            className="drop-shadow-lg w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
            src="/logo.png"
            alt="Chat App"
            width={80}
            height={80}
          />
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <h1 className="text-2xl md:text-4xl text-center text-gray-800 dark:text-white">
            Welcome to{" "}
            <span className={`font-bold ${gradientText}`}>ChatApp</span>
          </h1>
          <p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-300">
            Start a conversation with your friends now!
            <span role="img" aria-label="smile">
              😊
            </span>
            <br />
            <span className="hidden md:inline">
              Discover new connections and enjoy seamless communication.
            </span>
          </p>
        </div>
      </div>
      <p className="mt-auto pb-4 text-xs md:text-sm text-center text-gray-600 dark:text-gray-300">
        {lock} Secure and private messaging platform.
      </p>
    </div>
  );
}

export default MainContent;
