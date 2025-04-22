"use client"
import { useChatContext } from "@/context/chatContext"
import { useUserContext } from "@/context/userContext"
import { trash, xMark } from "@/utils/Icons"
import { gradientText } from "@/utils/TaiwindStyles"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"

function GroupInfo() {
  const { activeChatData, handleFriendProfile, showFriendProfile, updateGroupInfo, removeFromGroup, getUserById } =
    useChatContext()
  const { user } = useUserContext()
  const { edgestore } = useEdgeStore()

  const [groupName, setGroupName] = useState(activeChatData?.name || "")
  const [file, setFile] = useState<File>()
  const [isEditing, setIsEditing] = useState(false)
  const [groupMembers, setGroupMembers] = useState<any[]>([])

  useEffect(() => {
    setGroupName(activeChatData?.name || "")

    // Fetch group members
    const fetchGroupMembers = async () => {
      if (activeChatData?.participants) {
        const members = await Promise.all(
          activeChatData.participants.map(async (id: string) => {
            try {
              const userData = await getUserById(id)
              return userData
            } catch (error) {
              console.error("Error fetching user data:", error)
              return null
            }
          }),
        )

        setGroupMembers(members.filter(Boolean))
      }
    }

    fetchGroupMembers()
  }, [activeChatData, getUserById])

  const handleUploadImage = async () => {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            temporary: false,
          },
        })

        // Update group photo
        await updateGroupInfo(activeChatData._id, groupName, res.url)
        setIsEditing(false)
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const handleSaveChanges = async () => {
    if (file) {
      await handleUploadImage()
    } else {
      // Just update the group name
      await updateGroupInfo(activeChatData._id, groupName, activeChatData.photo)
      setIsEditing(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      await removeFromGroup(activeChatData._id, memberId)
    }
  }

  const isAdmin = activeChatData?.groupAdmin === user._id

  return (
    <div className="py-4 h-full flex flex-col justify-between overflow-y-auto">
      <div className="flex flex-col items-center">
        <button
          className="px-4 self-start p-1 text-xl sm:text-2xl flex items-center gap-4 sm:gap-8"
          onClick={() => handleFriendProfile(!showFriendProfile)}
        >
          <span className="pl-1 text-[#454e56] dark:text-white/65">{xMark}</span>
          <span className="text-[14px] sm:text-[16px] font-medium">Group Info</span>
        </button>

        <div className="relative mt-6 sm:mt-8 self-center">
          <Image
            src={activeChatData?.photo || "/placeholder.svg?height=200&width=200"}
            alt="Group Photo"
            width={150}
            height={150}
            className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer
              hover:scale-105 transition-transform duration-300 ease-in-out"
          />

          {isEditing && isAdmin && (
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0])
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>

        {isEditing && isAdmin ? (
          <div className="mt-2 px-4 w-full">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-[#3C3C3C] dark:border-[#3C3C3C]/65 dark:text-white"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border border-gray-300 rounded-md mr-2 dark:border-[#3C3C3C]/65 dark:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1 bg-[#7263f3] text-white rounded-md hover:bg-[#6253e3] text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <h2 className={`mt-2 px-4 font-bold self-center text-xl sm:text-2xl ${gradientText} dark:text-slate-100`}>
            {activeChatData?.name}
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                (Edit)
              </button>
            )}
          </h2>
        )}

        <div className="mt-6 py-4 w-full border-t-2 border-white self-start flex flex-col dark:border-[#3C3C3C]/60">
          <span className={`pl-4 font-medium text-[14px] sm:text-[16px] ${gradientText} dark:text-slate-200`}>
            Members ({groupMembers.length})
          </span>

          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {groupMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3C3C3C]/30"
              >
                <div className="flex items-center">
                  <Image
                    src={member.photo || "/placeholder.svg"}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                  <div>
                    <span className="dark:text-white text-sm sm:text-base">{member.name}</span>
                    {member._id === activeChatData?.groupAdmin && (
                      <span className="ml-2 text-xs text-[#7263f3]">(Admin)</span>
                    )}
                  </div>
                </div>

                {isAdmin && member._id !== user._id && (
                  <button onClick={() => handleRemoveMember(member._id)} className="text-red-500 hover:text-red-700">
                    {trash}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupInfo
