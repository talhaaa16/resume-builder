import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, ArrowRight } from "lucide-react";
import ChatJobCard from "./ChatJobCard";

const APP_LINKS = ["/resume-builder", "/ats-checker", "/interview-prep", "/linkedin-optimizer", "/jobs", "/dashboard"];
const INLINE_PATTERN = new RegExp(
  `(\\*\\*[^*]+\\*\\*|https?:\\/\\/[^\\s)]+|(?:${APP_LINKS.map(l => l.replace("/", "\\/")).join("|")})(?![\\w-]))`,
  "g"
);

const JOB_FOLLOW_UPS = ["Show me more jobs like these", "Only full-time jobs", "Jobs posted this week"];

const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

// Renders **bold**, external URLs, and in-app paths like /ats-checker as links.
const renderInline = (text, navigate, keyPrefix) =>
  text.split(INLINE_PATTERN).filter(Boolean).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={key} href={part} target="_blank" rel="noopener noreferrer" className="text-[#0076BC] underline underline-offset-2 break-all">
          {part}
        </a>
      );
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

const MessageText = ({ text, navigate }) => (
  <>
    {text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-1.5" />;
      const bullet = trimmed.match(/^(?:[-*•]|\d+[.)])\s+(.*)/);
      if (bullet) {
        return (
          <div key={i} className="flex gap-2 pl-0.5">
            <span className="text-[#0076BC] mt-px">•</span>
            <span>{renderInline(bullet[1], navigate, i)}</span>
          </div>
        );
      }
      return <p key={i}>{renderInline(trimmed, navigate, i)}</p>;
    })}
  </>
);

const ActionButton = ({ onClick, title, active, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1 rounded-md transition ${active ? "text-[#0076BC] bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
  >
    {children}
  </button>
);

const ChatMessage = ({ message, navigate, isLast, onFeedback, onRetry, onFollowUp }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => { });
  };

  const jobsLink = message.jobSearch?.query
    ? `/jobs?q=${encodeURIComponent(message.jobSearch.query)}${message.jobSearch.location ? `&loc=${encodeURIComponent(message.jobSearch.location)}` : ""}`
    : "/jobs";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-end"
      >
        <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[#0076BC] text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </div>
        {message.createdAt && <span className="text-[10px] text-gray-400 mt-1 mr-1">{formatTime(message.createdAt)}</span>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-2 group"
    >
      <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center mt-0.5">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`inline-block max-w-full px-3.5 py-2.5 rounded-2xl rounded-tl-md text-sm leading-relaxed space-y-1 break-words ${message.error
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-white text-gray-700 border border-gray-100 shadow-sm"
            }`}
        >
          <MessageText text={message.text} navigate={navigate} />
          {message.error && message.retryText && (
            <button
              onClick={() => onRetry(message.retryText)}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try again
            </button>
          )}
        </div>

        {message.jobs?.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.jobs.map((job, i) => (
              <ChatJobCard key={job.id || i} job={job} index={i} />
            ))}
            <button
              onClick={() => navigate(jobsLink)}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border border-blue-200 text-[#0076BC] bg-blue-50/60 hover:bg-blue-100 transition"
            >
              View all on Jobs page <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isLast && message.jobs?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {JOB_FOLLOW_UPS.map(f => (
              <button
                key={f}
                onClick={() => onFollowUp(f)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-white hover:border-[#0076BC] hover:text-[#0076BC] transition"
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {!message.local && !message.error && (
          <div className="flex items-center gap-0.5 mt-1">
            {message.createdAt && <span className="text-[10px] text-gray-400 mr-1.5 ml-1">{formatTime(message.createdAt)}</span>}
            {message._id && (
              <div className={`flex items-center gap-0.5 transition-opacity ${message.feedback ? "opacity-100" : "sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"}`}>
                <ActionButton onClick={handleCopy} title="Copy">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </ActionButton>
                <ActionButton
                  onClick={() => onFeedback(message, message.feedback === "up" ? null : "up")}
                  title="Helpful"
                  active={message.feedback === "up"}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </ActionButton>
                <ActionButton
                  onClick={() => onFeedback(message, message.feedback === "down" ? null : "down")}
                  title="Not helpful"
                  active={message.feedback === "down"}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </ActionButton>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
