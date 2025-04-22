import React, { useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { IUser } from "@/types/type";

interface GroupManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any; // Should match the group chat object shape
  currentUser: IUser;
  users: IUser[]; // All users in the system (for member picker)
}


const GroupManageModal: React.FC<GroupManageModalProps> = ({ isOpen, onClose, group, currentUser, users }) => {
  const { renameGroup, addToGroup, removeFromGroup, transferAdmin } = useChatContext();
  const [groupName, setGroupName] = useState(group?.name || "");
  const [newMemberId, setNewMemberId] = useState("");
  const [newAdminId, setNewAdminId] = useState("");
  // For user picker
  const availableUsers = users.filter(
    (u: IUser) =>
      u._id !== currentUser._id &&
      !(group.participantsData || []).some((m: IUser) => m._id === u._id)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Rename group handler
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await renameGroup(group._id, groupName);
      setSuccess("Group name updated!");
    } catch (err) {
      setError("Failed to rename group.");
    }
    setLoading(false);
  };

  // Add member handler
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addToGroup(group._id, [newMemberId]);
      setSuccess("Member added!");
      setNewMemberId("");
    } catch (err) {
      setError("Failed to add member.");
    }
    setLoading(false);
  };

  // Remove member handler
  const handleRemoveMember = async (userId: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await removeFromGroup(group._id, userId);
      setSuccess("Member removed!");
    } catch (err) {
      setError("Failed to remove member.");
    }
    setLoading(false);
  };

  // Transfer admin handler
  const handleTransferAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await transferAdmin(group._id, newAdminId);
      setSuccess("Admin rights transferred!");
    } catch (err) {
      setError("Failed to transfer admin rights.");
    }
    setLoading(false);
  };

  // Leave group handler
  const handleLeaveGroup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await removeFromGroup(group._id, currentUser._id);
      setSuccess("You left the group.");
      onClose();
    } catch (err) {
      setError("Failed to leave group.");
    }
    setLoading(false);
  };


  if (!isOpen) return null;

  // Only admin can manage
  const isAdmin = group.groupAdmin === currentUser._id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#262626] rounded-lg p-6 w-full max-w-md">
        <h2 className="font-bold text-2xl mb-4 text-gray-800 dark:text-white">Manage Group</h2>
        {isAdmin ? (
          <>
            <form onSubmit={handleRename} className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-white">Rename Group</label>
              <input
                className="w-full mb-2 px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-[#181818]"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                required
              />
              <button type="submit" className="px-4 py-2 rounded bg-[#7263f3] text-white" disabled={loading}>Rename</button>
            </form>
            {/* Transfer Admin */}
            <form onSubmit={handleTransferAdmin} className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-white">Transfer Admin Rights</label>
              <div className="flex gap-2 items-center mb-2">
                <select
                  className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-[#181818]"
                  value={newAdminId}
                  onChange={e => setNewAdminId(e.target.value)}
                  required
                >
                  <option value="">Select member...</option>
                  {group.participantsData && group.participantsData.filter((m: IUser) => m._id !== group.groupAdmin).map((m: IUser) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                {newAdminId && (
                  <img
                    src={group.participantsData?.find((m: IUser) => m._id === newAdminId)?.photo}
                    alt={group.participantsData?.find((m: IUser) => m._id === newAdminId)?.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                )}
              </div>
              <button type="submit" className="px-4 py-2 rounded bg-[#7263f3] text-white" disabled={loading || !newAdminId}>Transfer</button>
            </form>
            <form onSubmit={handleAddMember} className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-white">Add Member</label>
              <div className="flex gap-2 items-center mb-2">
                <select
                  className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-[#181818]"
                  value={newMemberId}
                  onChange={e => setNewMemberId(e.target.value)}
                  required
                >
                  <option value="">Select user...</option>
                  {availableUsers.map((u: IUser) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
                {newMemberId && (
                  <img
                    src={availableUsers.find(u => u._id === newMemberId)?.photo}
                    alt={availableUsers.find(u => u._id === newMemberId)?.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                )}
              </div>
              <button type="submit" className="px-4 py-2 rounded bg-[#7263f3] text-white" disabled={loading || !newMemberId}>Add</button>
            </form>
            <div>
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">Members</h3>
              <ul>
                {group.participantsData && group.participantsData.map((member: IUser) => (
                  <li key={member._id} className="flex items-center justify-between mb-2">
                    <span>{member.name} {member._id === group.groupAdmin && <span className="text-xs ml-1 text-[#7263f3]">(Admin)</span>}</span>
                    {member._id !== group.groupAdmin && (
                      <button
                        className="px-2 py-1 rounded bg-red-500 text-white text-xs"
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={loading}
                      >Remove</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-red-500">Only the group admin can manage the group.</div>
        )}
        {(error || success) && <div className={error ? "text-red-500" : "text-green-500"}>{error || success}</div>}
        <div className="flex gap-2 justify-between mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white">Close</button>
          <button onClick={handleLeaveGroup} className="px-4 py-2 rounded bg-red-500 text-white" disabled={loading}>Leave Group</button>
        </div>
      </div>
    </div>
  );
};

export default GroupManageModal;
