import { useEffect, useRef, useState } from "react";
import CompassMark from "./CompassMark.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Chat({ user, conversationId, onNeedConversation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (conversationId) loadMessages(conversationId);
    else setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function loadMessages(id) {
   const res = await fetch(`${API_URL}/api/chat/conversations/${id}/messages`);
    const data = await res.json();
    setMessages(data);
  }

  async function send() {
    if (!input.trim() || sending) return;
    let convoId = conversationId;
    if (!convoId) {
      convoId = await onNeedConversation(input.slice(0, 40));
    }

    const text = input;
    setInput("");
    setSending(true);
    setMessages((m) => [...m, { id: "temp-user", role: "user", content: text }]);

    try {
     const res = await fetch(`${API_URL}/api/chat/conversations/${convoId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages((m) => [...m.filter((x) => x.id !== "temp-user"), data.userMessage, data.assistantMessage]);
    } catch (err) {
      setMessages((m) => [
        ...m.filter((x) => x.id !== "temp-user"),
        { id: "temp-user", role: "user", content: text },
        { id: "err", role: "assistant", content: `⚠️ ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate">
            <CompassMark size={40} />
            <p className="mt-4 font-display text-2xl text-paper">Where do you want to head?</p>
            <p className="mt-1 font-body text-sm max-w-sm">
              Ask about interview prep, closing a skill gap, or what your next move should be.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {sending && <MessageBubble role="assistant" content="…" pending />}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#2E333F] px-6 py-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask your advisor..."
            className="flex-1 resize-none bg-ink-soft border border-[#2E333F] rounded-sm px-4 py-3 text-paper font-body outline-none focus:border-compass"
          />
          <button
            onClick={send}
            disabled={sending}
            className="px-5 bg-compass text-ink font-mono text-sm uppercase tracking-wide rounded-sm hover:bg-compass-dim transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, pending }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-sm font-body text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-compass text-ink"
            : "bg-ink-soft text-paper border border-[#2E333F]"
        } ${pending ? "opacity-60 italic" : ""}`}
      >
        {content}
      </div>
    </div>
  );
}
