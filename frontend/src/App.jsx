import { useEffect, useState } from "react";
import ProfileForm from "./components/ProfileForm.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Chat from "./components/Chat.jsx";
import ResumeReview from "./components/ResumeReview.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("chat");
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Restore the last user from localStorage on load
  useEffect(() => {
    const savedId = localStorage.getItem("careerAdvisorUserId");
    if (savedId) {
      fetch(`/api/profile/${savedId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((u) => u && setUser(u))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("careerAdvisorUserId", user.id);
      refreshConversations(user.id);
    }
  }, [user]);

  async function refreshConversations(userId) {
    const res = await fetch(`/api/chat/conversations/user/${userId}`);
    const data = await res.json();
    setConversations(data);
    if (data.length > 0 && !activeId) setActiveId(data[0].id);
  }

  async function createConversation(title) {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, title }),
    });
    const convo = await res.json();
    setConversations((c) => [convo, ...c]);
    setActiveId(convo.id);
    return convo.id;
  }

  if (loadingUser) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-ink">
        <ProfileForm onCreated={setUser} />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-ink">
      <Sidebar
        user={user}
        view={view}
        setView={setView}
        conversations={conversations}
        activeId={activeId}
        setActiveId={setActiveId}
        onNewChat={() => setActiveId(null)}
      />
      <main className="flex-1 min-w-0">
        {view === "chat" ? (
          <Chat user={user} conversationId={activeId} onNeedConversation={createConversation} />
        ) : (
          <ResumeReview user={user} />
        )}
      </main>
    </div>
  );
}
