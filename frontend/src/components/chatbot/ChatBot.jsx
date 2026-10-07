import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Bot, X, Send, MessageCircle, History, Plus, ArrowLeft, Briefcase,
  FileText, Sparkles, MessageSquareText, LogIn, Loader2,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatHistory from "./ChatHistory";
import * as chatApi from "./chatApi";
import { OPEN_CHATBOT_EVENT } from "./chatEvents";

const HIDDEN_PATHS = ["/admin", "/r/", "/login", "/signup", "/linkedin-callback"];
const MAX_LENGTH = 1000;
const TEASER_DELAY_MS = 2500;
const TEASER_DURATION_MS = 12000;
const WIGGLE_INTERVAL_MS = 4500;

const QUICK_ACTIONS = [
  { icon: Briefcase, label: "Find jobs for me", prompt: "Find jobs that match my resume" },
  { icon: FileText, label: "Summarize my resume", prompt: "Summarize my resume" },
  { icon: Sparkles, label: "Improve my resume", prompt: "How can I improve my resume?" },
  { icon: MessageSquareText, label: "Interview tips", prompt: "Give me interview tips for my profile" },
];

// sessionStorage can throw (private mode, blocked storage) — never let that break the widget.
const session = {
  get: (key) => { try { return sessionStorage.getItem(key); } catch { return null; } },
  set: (key, value) => {
    try {
      if (value == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch { }
  },
};

const launcherVariants = {
  hidden: { scale: 0, opacity: 0 },
  idle: { scale: 1, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 18 } },
  wiggle: {
    scale: [1, 1.15, 1.05, 1.12, 1],
    rotate: [0, -16, 14, -10, 6, 0],
    transition: { duration: 0.9, ease: "easeInOut" },
  },
};

const ChatBot = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const username = localStorage.getItem("uname") || "";
  const useremail = localStorage.getItem("uemail") || "";
  const firstName = username.split(" ")[0];
  const conversationKey = `chatbot:conversation:${useremail}`;
  const hidden = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("chat");
  const [conversationId, setConversationId] = useState(() => session.get(conversationKey));
  const [loadedConversationId, setLoadedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [usesLeft, setUsesLeft] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [attention, setAttention] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasOpenedChat, setHasOpenedChat] = useState(() => session.get("chatbot:opened") === "1");
  const [pendingPrompt, setPendingPrompt] = useState(null);

  const isOpenRef = useRef(isOpen);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // A different user logged in (or out) in this tab — switch to their conversation.
  useEffect(() => {
    setConversationId(session.get(conversationKey));
    setLoadedConversationId(null);
    setMessages([]);
    setUsesLeft(null);
    setView("chat");
  }, [conversationKey]);

  useEffect(() => {
    session.set(conversationKey, conversationId);
  }, [conversationId, conversationKey]);

  // Load the active conversation from the DB the first time the chat opens.
  useEffect(() => {
    if (!isOpen || !isLoggedIn || !conversationId || loadedConversationId === conversationId) return;
    let cancelled = false;
    setIsLoadingConversation(true);
    chatApi.getConversation(conversationId)
      .then(data => {
        if (cancelled) return;
        setMessages(data.messages || []);
        setLoadedConversationId(conversationId);
      })
      .catch(() => {
        if (cancelled) return;
        // Conversation was deleted or is invalid — start fresh.
        setConversationId(null);
        setMessages([]);
      })
      .finally(() => !cancelled && setIsLoadingConversation(false));
    return () => { cancelled = true; };
  }, [isOpen, isLoggedIn, conversationId, loadedConversationId]);

  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;
    chatApi.getChatStatus().then(data => setUsesLeft(data.usesLeft)).catch(() => { });
  }, [isOpen, isLoggedIn]);

  // Greet visitors once per session: wiggle the launcher and show a teaser bubble.
  useEffect(() => {
    if (hidden || session.get("chatbot:teaserShown")) return;
    const showTimer = setTimeout(() => {
      if (isOpenRef.current) return;
      session.set("chatbot:teaserShown", "1");
      setShowTeaser(true);
    }, TEASER_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [hidden]);

  useEffect(() => {
    if (!showTeaser) return;
    setAttention(true);
    const wiggle = setInterval(() => setAttention(true), WIGGLE_INTERVAL_MS);
    const hide = setTimeout(() => setShowTeaser(false), TEASER_DURATION_MS);
    return () => { clearInterval(wiggle); clearTimeout(hide); };
  }, [showTeaser]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowTeaser(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isSending, isOpen, view]);

  useEffect(() => {
    if (isOpen && view === "chat" && isLoggedIn) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen, view, isLoggedIn]);

  // Auto-grow the textarea with its content.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setShowTeaser(false);
    setHasUnread(false);
    setHasOpenedChat(true);
    session.set("chatbot:opened", "1");
  }, []);

  // Other pages open the assistant through openChatbot() in chatEvents.js.
  useEffect(() => {
    const handleOpen = (event) => {
      openChat();
      setView("chat");
      const prompt = event.detail?.prompt;
      if (prompt) {
        // A prompt from another page starts a fresh conversation.
        setConversationId(null);
        setLoadedConversationId(null);
        setMessages([]);
        setPendingPrompt(prompt);
      }
    };
    window.addEventListener(OPEN_CHATBOT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CHATBOT_EVENT, handleOpen);
  }, [openChat]);

  const toggleChat = () => (isOpen ? setIsOpen(false) : openChat());

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 640) setIsOpen(false);
  };

  const sendMessage = useCallback(async (text, { retry = false } = {}) => {
    const message = (text ?? input).trim();
    if (!message || isSending || !isLoggedIn) return;

    // On retry the user's bubble is already shown — only remove the error.
    let pendingId;
    if (retry) {
      const lastUser = [...messages].reverse().find(m => m.role === "user");
      pendingId = lastUser?._id;
      setMessages(prev => prev.filter(m => !m.error));
    } else {
      pendingId = `temp-${Date.now()}`;
      setMessages(prev => [
        ...prev.filter(m => !m.error),
        { _id: pendingId, role: "user", text: message, createdAt: new Date().toISOString() },
      ]);
      setInput("");
    }
    setIsSending(true);

    const adoptConversation = (conversation) => {
      if (conversation?._id && conversation._id !== conversationId) {
        setLoadedConversationId(conversation._id);
        setConversationId(conversation._id);
      }
    };
    const replacePending = (userMessage) => {
      if (userMessage) setMessages(prev => prev.map(m => (m._id === pendingId ? userMessage : m)));
    };

    try {
      const data = await chatApi.sendChatMessage(message, conversationId || undefined);
      adoptConversation(data.conversation);
      replacePending(data.userMessage);
      setMessages(prev => [...prev, data.reply]);
      setUsesLeft(data.usesLeft);
      if (!isOpenRef.current) setHasUnread(true);
    } catch (err) {
      const data = err.response?.data || {};
      adoptConversation(data.conversation);
      replacePending(data.userMessage);
      if (err.response?.status === 404 && data.msg === "Conversation not found.") {
        setConversationId(null);
        setLoadedConversationId(null);
      }
      if (data.limitReached) setUsesLeft(0);
      setMessages(prev => [...prev, {
        _id: `error-${Date.now()}`,
        role: "model",
        error: true,
        text: data.msg || "Couldn't reach the assistant. Check your connection and try again.",
        retryText: data.limitReached ? null : message,
      }]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, isLoggedIn, messages, conversationId]);

  useEffect(() => {
    if (!pendingPrompt || !isOpen || isSending || conversationId) return;
    if (isLoggedIn) sendMessage(pendingPrompt);
    setPendingPrompt(null);
  }, [pendingPrompt, isOpen, isSending, conversationId, isLoggedIn, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (message, feedback) => {
    const previous = message.feedback || null;
    setMessages(prev => prev.map(m => (m._id === message._id ? { ...m, feedback } : m)));
    try {
      await chatApi.setMessageFeedback(message._id, feedback);
    } catch {
      setMessages(prev => prev.map(m => (m._id === message._id ? { ...m, feedback: previous } : m)));
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setLoadedConversationId(null);
    setMessages([]);
    setInput("");
    setView("chat");
  };

  const openHistory = async () => {
    setView("history");
    setHistoryLoading(true);
    try {
      const data = await chatApi.getConversations();
      setConversations(data.conversations || []);
    } catch {
      setConversations([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const selectConversation = (id) => {
    if (id !== conversationId) {
      setMessages([]);
      setLoadedConversationId(null);
      setConversationId(id);
    }
    setView("chat");
  };

  const removeConversation = async (id) => {
    setConversations(prev => prev.filter(c => c._id !== id));
    if (id === conversationId) startNewChat();
    try {
      await chatApi.deleteConversation(id);
    } catch {
      openHistory();
    }
  };

  if (hidden) return null;

  const lastMessage = messages[messages.length - 1];
  const showEmptyState = isLoggedIn && !isLoadingConversation && messages.length === 0;
  const limitReached = usesLeft === 0;

  return (
    <MotionConfig reducedMotion="user">
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 26 } }}
            exit={{ opacity: 0, y: 24, scale: 0.92, transition: { duration: 0.18, ease: "easeIn" } }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed z-[45] bottom-[5.5rem] left-3 right-3 sm:left-auto sm:right-6 sm:w-[400px] h-[min(620px,calc(100vh-7rem))] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 py-3 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {view === "history" ? (
                  <button onClick={() => setView("chat")} title="Back to chat" className="p-1.5 rounded-lg hover:bg-white/20 transition">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-[#0a8f9a]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">{view === "history" ? "Your chats" : "Yuva Assistant"}</p>
                  <p className="text-[11px] text-white/80 truncate">
                    {view === "history" ? "Pick up where you left off" : "Jobs, resume help & career tips"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {isLoggedIn && view === "chat" && (
                  <>
                    <button onClick={startNewChat} title="New chat" className="p-1.5 rounded-lg hover:bg-white/20 transition">
                      <Plus className="w-[18px] h-[18px]" />
                    </button>
                    <button onClick={openHistory} title="Chat history" className="p-1.5 rounded-lg hover:bg-white/20 transition">
                      <History className="w-[18px] h-[18px]" />
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)} title="Close" className="p-1.5 rounded-lg hover:bg-white/20 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isLoggedIn ? (
              /* Guest view */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-gray-50/60">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center shadow-lg mb-4"
                >
                  <Bot className="w-8 h-8" />
                </motion.div>
                <p className="text-lg font-bold text-gray-800">Hi there! 👋</p>
                <p className="text-sm text-gray-500 mt-1.5 mb-6">
                  Log in to chat with Yuva Assistant. I can find jobs that match your resume, review your profile, and help you prepare for interviews.
                </p>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0076BC] text-white text-sm font-bold hover:bg-blue-700 transition"
                >
                  <LogIn className="w-4 h-4" /> Log in
                </button>
                <button
                  onClick={() => handleNavigate("/signup")}
                  className="w-full mt-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-white transition"
                >
                  Create a free account
                </button>
              </div>
            ) : view === "history" ? (
              <ChatHistory
                conversations={conversations}
                loading={historyLoading}
                activeId={conversationId}
                onSelect={selectConversation}
                onDelete={removeConversation}
                onNewChat={startNewChat}
              />
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/60">
                  {isLoadingConversation && (
                    <div className="flex justify-center py-10 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}

                  {showEmptyState && (
                    <div className="pt-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-5"
                      >
                        <motion.div
                          animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                          transition={{ duration: 1.4, delay: 0.3 }}
                          className="inline-block text-3xl mb-2"
                        >
                          👋
                        </motion.div>
                        <p className="text-base font-bold text-gray-800">Hi {firstName || "there"}!</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Ask me about your profile and resumes, or tell me what job you're looking for.
                        </p>
                      </motion.div>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }, i) => (
                          <motion.button
                            key={label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.07 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => sendMessage(prompt)}
                            disabled={limitReached}
                            className="text-left p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition disabled:opacity-50"
                          >
                            <Icon className="w-5 h-5 text-[#0076BC] mb-1.5" />
                            <span className="text-xs font-semibold text-gray-700">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => (
                    <ChatMessage
                      key={m._id}
                      message={m}
                      navigate={handleNavigate}
                      isLast={m === lastMessage && !isSending}
                      onFeedback={handleFeedback}
                      onRetry={(text) => sendMessage(text, { retry: true })}
                      onFollowUp={(text) => sendMessage(text)}
                    />
                  ))}

                  {isSending && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-center">
                      <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-md flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 bg-[#0076BC]/50 rounded-full"
                            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-100 bg-white px-3 pt-3 pb-2 shrink-0">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      maxLength={MAX_LENGTH}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={limitReached}
                      placeholder={limitReached ? "Daily limit reached — come back tomorrow" : "Ask anything or search jobs..."}
                      className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isSending || limitReached}
                      title="Send"
                      className="w-10 h-10 shrink-0 rounded-xl bg-[#0076BC] text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 px-1 text-[10px] text-gray-400">
                    <span>{usesLeft != null ? `${usesLeft} messages left today` : " "}</span>
                    {input.length > MAX_LENGTH * 0.8 && <span>{input.length}/{MAX_LENGTH}</span>}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser bubble shown once per session */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            key="chat-teaser"
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            exit={{ opacity: 0, y: 8, scale: 0.9, transition: { duration: 0.15 } }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed z-[45] bottom-[5.5rem] right-4 sm:right-6 max-w-[17rem]"
          >
            <div
              onClick={openChat}
              className="relative cursor-pointer bg-white rounded-2xl rounded-br-md shadow-xl border border-gray-100 pl-3 pr-7 py-3 flex gap-2.5 items-start hover:shadow-2xl transition-shadow"
            >
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-700 leading-snug">
                {isLoggedIn
                  ? <>Hi <span className="font-bold">{firstName || "there"}</span> 👋 Want me to find jobs that match your resume?</>
                  : <>👋 Hi! I'm <span className="font-bold">Yuva Assistant</span>. I can find jobs and review your resume.</>}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
                title="Dismiss"
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      <motion.button
        variants={launcherVariants}
        initial="hidden"
        animate={attention ? "wiggle" : "idle"}
        onAnimationComplete={(definition) => definition === "wiggle" && setAttention(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleChat}
        title={isOpen ? "Close assistant" : "Chat with Yuva Assistant"}
        className="fixed z-[45] bottom-5 right-4 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center"
      >
        {!hasOpenedChat && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#0076BC] opacity-40 animate-ping" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "chat"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18 }}
            className="relative flex"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.span>
        </AnimatePresence>
        {hasUnread && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </motion.button>
    </MotionConfig>
  );
};

export default ChatBot;
