import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Plus, Check, X, Loader2 } from "lucide-react";

const relativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString([], { day: "numeric", month: "short" });
};

const ChatHistory = ({ conversations, loading, activeId, onSelect, onDelete, onNewChat }) => {
  const [confirmId, setConfirmId] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-gray-50/60">
      <button
        onClick={onNewChat}
        className="w-full mb-3 inline-flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-[#0076BC] hover:bg-blue-50 transition"
      >
        <Plus className="w-4 h-4" /> New chat
      </button>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-10 px-4">
          <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-600">No chats yet</p>
          <p className="text-xs text-gray-400 mt-1">Your conversations will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {conversations.map((c, i) => (
              <motion.li
                key={c._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: Math.min(i, 8) * 0.03 } }}
                exit={{ opacity: 0, x: 20, height: 0, marginTop: 0 }}
                className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition ${c._id === activeId ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 hover:border-blue-200"}`}
                onClick={() => confirmId !== c._id && onSelect(c._id)}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${c._id === activeId ? "text-[#0076BC]" : "text-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{c.title}</p>
                  <p className="text-[11px] text-gray-400">{relativeTime(c.lastMessageAt)} · {c.messageCount} messages</p>
                </div>
                {confirmId === c._id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { onDelete(c._id); setConfirmId(null); }}
                      title="Confirm delete"
                      className="p-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConfirmId(null)} title="Cancel" className="p-1 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmId(c._id); }}
                    title="Delete chat"
                    className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;
