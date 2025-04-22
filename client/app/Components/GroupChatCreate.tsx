import React, { useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IUser } from "@/types/type";

interface GroupChatCreateProps {
  users: IUser[];
  onClose: () => void;
  onCreated?: (group: any) => void;
}

const GroupChatCreate: React.FC<GroupChatCreateProps> = ({ users, onClose, onCreated }) => {
  const { createGroupChat } = useChatContext();
  const { user } = useUserContext();
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!groupName.trim() || selected.length < 2) {
      setError("Group name and at least 2 members required");
      return;
    }
    setLoading(true);
    const group = await createGroupChat(groupName, [user._id, ...selected], user._id);
    setLoading(false);
    if (group) {
      onCreated?.(group);
      onClose();
    } else {
      setError("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#262626] rounded-lg p-6 w-full max-w-md">
        <h2 className="font-bold text-2xl mb-4 text-gray-800 dark:text-white">Create Group Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-3 px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-[#181818]"
            placeholder="Group Name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            required
          />
          <div className="max-h-40 overflow-y-auto mb-4">
            {users.filter(u => u._id !== user._id).map(u => (
              <label key={u._id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(u._id)}
                  onChange={() => handleToggle(u._id)}
                  className="accent-[#7263f3]"
                />
                <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-gray-800 dark:text-white">{u.name}</span>
              </label>
            ))}
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#7263f3] text-white" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupChatCreate;
