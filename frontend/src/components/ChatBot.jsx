import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, X, Send, RotateCcw, MessageCircle } from "lucide-react";
import axios from "axios";

const HIDDEN_PATHS = ["/admin", "/r/", "/login", "/signup", "/linkedin-callback"];
const MAX_HISTORY = 12;

const SUGGESTIONS = [
  "Summarize my resume",
  "What skills do I have?",
  "How can I improve my resume?",
  "Which job roles suit me?",
];

const APP_LINKS = ["/resume-builder", "/ats-checker", "/interview-prep", "/linkedin-optimizer", "/jobs", "/dashboard"];

const greeting = (name) => ({
  role: "model",
  text: `Hi ${name || "there"}! 👋 I'm Yuva Assistant. Ask me anything about your profile, your saved resumes, or how to land your next job.`,
  local: true,
});

const storageKey = (email) => `chatbot:${email || "user"}`;

const loadMessages = (email, name) => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(email)));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { }
  return [greeting(name)];
};

const saveMessages = (email, messages) => {
  try {
    sessionStorage.setItem(storageKey(email), JSON.stringify(messages));
  } catch { }
};

// Renders **bold** text and turns in-app paths like /ats-checker into links.
const renderInline = (text, navigate, keyPrefix) => {
  const pattern = new RegExp(`(\\*\\*[^*]+\\*\\*|${APP_LINKS.map(l => l.replace("/", "\\/")).join("|")})`, "g");
  return text.split(pattern).filter(Boolean).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (APP_LINKS.includes(part)) {
      return (
        <button key={key} onClick={() => navigate(part)} className="text-[#0076BC] font-semibold underline underline-offset-2 hover:opacity-80">
          {part}
        </button>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

const MessageText = ({ text, navigate }) => (
  <>
    {text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      const bullet = trimmed.match(/^[-*•]\s+(.*)/);
      if (bullet) {
        return (
          <div key={i} className="flex gap-2 pl-1">
            <span className="text-[#0076BC] mt-0.5">•</span>
            <span>{renderInline(bullet[1], navigate, i)}</span>
          </div>
        );
      }
      return <p key={i}>{renderInline(trimmed, navigate, i)}</p>;
    })}
  </>
);

const ChatBot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("uname");
  const useremail = localStorage.getItem("uemail");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadMessages(useremail, username));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reload the conversation when a different user logs in within the same tab.
  useEffect(() => {
    setMessages(loadMessages(useremail, username));
  }, [useremail, username]);

  useEffect(() => {
    saveMessages(useremail, messages);
  }, [messages, useremail]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!token || HIDDEN_PATHS.some(p => location.pathname.startsWith(p))) return null;

  const sendMessage = async (text) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    const history = messages
      .filter(m => !m.local && !m.error)
      .slice(-MAX_HISTORY)
      .map(({ role, text }) => ({ role, text }));

    setMessages(prev => [...prev, { role: "user", text: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/ai/chat`,
        { message, history },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0) {
        setMessages(prev => [...prev, { role: "model", text: res.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "model", text: res.data.msg || "Something went wrong.", error: true }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "model",
        text: err.response?.data?.msg || "The assistant is unavailable right now. Please try again.",
        error: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([greeting(username)]);
    setInput("");
  };

  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[55] w-[calc(100vw-2rem)] sm:w-96 h-[32rem] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-chatPop">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Yuva Assistant</p>
                <p className="text-[11px] text-white/80">Ask about your profile & resumes</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Start new chat"
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed space-y-1 break-words ${m.role === "user"
                    ? "bg-[#0076BC] text-white rounded-br-md"
                    : m.error
                      ? "bg-red-50 text-red-600 border border-red-100 rounded-bl-md"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
                    }`}
                >
                  {m.role === "user" ? <p className="whitespace-pre-wrap">{m.text}</p> : <MessageText text={m.text} navigate={navigate} />}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 text-[#0076BC] bg-blue-50 hover:bg-[#0076BC] hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-end gap-2 shrink-0">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 resize-none max-h-28 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 shrink-0 rounded-xl bg-[#0076BC] text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close assistant" : "Chat with Yuva Assistant"}
        className="fixed bottom-6 right-4 sm:right-6 z-[55] w-14 h-14 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};

export default ChatBot;
