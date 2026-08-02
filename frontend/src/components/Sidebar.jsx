import CompassMark from "./CompassMark.jsx";

export default function Sidebar({ user, view, setView, conversations, activeId, setActiveId, onNewChat }) {
  return (
    <aside className="w-64 shrink-0 bg-ink-soft border-r border-[#2E333F] flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-[#2E333F]">
        <CompassMark size={24} />
        <span className="font-display text-lg text-paper">Compass</span>
      </div>

      <nav className="px-3 py-3 space-y-1">
        <NavButton active={view === "chat"} onClick={() => setView("chat")}>
          Advisor chat
        </NavButton>
        <NavButton active={view === "resume"} onClick={() => setView("resume")}>
          Resume review
        </NavButton>
      </nav>

      {view === "chat" && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wide text-slate">Conversations</span>
            <button onClick={onNewChat} className="text-compass text-xs font-mono hover:underline">
              + New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
            {conversations.length === 0 && (
              <p className="px-2 text-xs text-slate font-body">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm font-body truncate ${
                  activeId === c.id ? "bg-[#2A2F3A] text-paper" : "text-slate hover:bg-[#232732]"
                }`}
              >
                {c.title || "New conversation"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-[#2E333F] text-xs font-mono text-slate">
        {user?.name}
      </div>
    </aside>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-sm text-sm font-body transition-colors ${
        active ? "bg-compass text-ink" : "text-paper hover:bg-[#232732]"
      }`}
    >
      {children}
    </button>
  );
}
