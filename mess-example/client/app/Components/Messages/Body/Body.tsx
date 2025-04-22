"use client"

import { useChatContext } from "@/context/chatContext"
import { useUserContext } from "@/context/userContext"
import type { IMessage } from "@/types/type"
import { useEffect, useLayoutEffect, useRef } from "react"
import Sender from "../Sender/Sender"
import Recever from "../Receiver/Recever"

function Body() {
  const messageBodyRef = useRef(null) as any

  const { messages, arrivedMessage, selectedChat } = useChatContext()
  const userId = useUserContext().user?._id

  const scrollToBottom = (behavior = "smooth") => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTo({
        top: messageBodyRef.current.scrollHeight,
        behavior,
      })
    }
  }

  // scroll to bottom on initial page load
  useLayoutEffect(() => {
    scrollToBottom("auto")
  }, [])

  useEffect(() => {
    if (arrivedMessage && arrivedMessage.sender !== userId) {
      scrollToBottom("smooth")
    }
  }, [arrivedMessage])

  // scroll to bottom on when a new message is sent
  useEffect(() => {
    scrollToBottom("auto")
  }, [messages])

  const isGroupChat = selectedChat?.isGroup

  return (
    <div ref={messageBodyRef} className="message-body relative flex-1 p-2 sm:p-4 overflow-y-auto">
      <div className="relative flex flex-col">
        {messages.map((message: IMessage) =>
          message.sender === userId ? (
            <div key={message?._id} className="self-end mb-2">
              <Sender status={message.status} content={message.content} createdAt={message.createdAt} />
            </div>
          ) : (
            <div key={message?._id}>
              <Recever
                messageId={message?._id}
                content={message.content}
                createdAt={message.createdAt}
                senderId={isGroupChat ? message.sender : undefined}
              />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export default Body
