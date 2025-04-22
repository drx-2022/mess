"use client"
import { useChatContext } from "@/context/chatContext"
import type React from "react"

import { useUserContext } from "@/context/userContext"
import { xMark } from "@/utils/Icons"
import { gradientText } from "@/utils/TaiwindStyles"
import Image from "next/image"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"

function CreateGroup() {
  const { setShowCreateGroup, selectedUsers, setSelectedUsers, createGroupChat, getUserById } = useChatContext()
  // Add this at the top of the component to get the current user
  const { user: currentUser } = useUserContext()
  const { edgestore } = useEdgeStore()

  const [groupName, setGroupName] = useState("")
  const [file, setFile] = useState<File>()
  const [groupPhoto, setGroupPhoto] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Handle file upload
  const handleUploadImage = async () => {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            temporary: false,
          },
        })

        setGroupPhoto(res.url)
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  // Search for friends
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim()) {
      // Filter friends based on search term
      const filteredFriendsPromises = currentUser.friends.map(async (friendId: string) => {
        try {
          const friendData = await getUserById(friendId)
          return friendData
        } catch (error) {
          console.error("Error fetching friend data:", error)
          return null
        }
      })

      Promise.all(filteredFriendsPromises).then((filteredFriends) => {
        const results = filteredFriends
          .filter((friend) => friend && friend.name.toLowerCase().includes(value.toLowerCase()))
          // Filter out the current user from search results
          .filter((friend) => friend && friend._id !== currentUser._id)
          .filter(Boolean)

        setSearchResults(results)
      })
    } else {
      setSearchResults([])
    }
  }

  // Add user to selected users
  const handleUserSelect = (user: any) => {
    // Don't add if it's the current user or already in selected users
    if (user._id === currentUser._id) {
      return // Don't add the current user to selected users
    }

    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user])
    }
    setSearchTerm("")
    setSearchResults([])
  }

  // Remove user from selected users
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId))
  }

  // Create group
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      return alert("Please enter a group name")
    }

    if (selectedUsers.length < 2) {
      return alert("Please select at least 2 users")
    }

    // Upload image if selected
    if (file && !groupPhoto) {
      await handleUploadImage()
    }

    // Make sure participants array doesn't have duplicates
    const participantIds = [...new Set([...selectedUsers.map((u) => u._id), currentUser._id])]

    // Create group chat
    await createGroupChat({
      name: groupName,
      participants: participantIds,
      adminId: currentUser._id,
      groupPhoto: groupPhoto || "https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#262626] rounded-lg p-4 sm:p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl sm:text-2xl font-bold ${gradientText} dark:text-white`}>Create Group Chat</h2>
          <button
            onClick={() => setShowCreateGroup(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            {xMark}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md dark:bg-[#3C3C3C] dark:border-[#3C3C3C]/65 dark:text-white"
            placeholder="Enter group name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Group Photo</label>
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-[#7263f3]">
              <Image
                src={groupPhoto || "/placeholder.svg?height=64&width=64"}
                alt="Group Photo"
                width={64}
                height={64}
                className="object-cover"
              />
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0])
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Add Members</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md dark:bg-[#3C3C3C] dark:border-[#3C3C3C]/65 dark:text-white"
            placeholder="Search friends"
          />

          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-md max-h-40 overflow-y-auto dark:border-[#3C3C3C]/65">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#3C3C3C] cursor-pointer flex items-center"
                  onClick={() => handleUserSelect(user)}
                >
                  <Image
                    src={user.photo || "/placeholder.svg"}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                  <span className="dark:text-white">{user.name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-700 dark:text-gray-200 mb-2">Selected Users:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div key={user._id} className="flex items-center bg-[#7263f3] text-white px-2 py-1 rounded-full">
                    <span className="mr-1">{user.name}</span>
                    <button onClick={() => handleRemoveUser(user._id)} className="text-white hover:text-gray-200">
                      {xMark}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowCreateGroup(false)}
            className="px-4 py-2 border border-gray-300 rounded-md mr-2 dark:border-[#3C3C3C]/65 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-[#7263f3] text-white rounded-md hover:bg-[#6253e3]"
            disabled={!groupName.trim() || selectedUsers.length < 2}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup
