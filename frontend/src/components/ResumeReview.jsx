import { useState } from "react";

export default function ResumeReview({ user }) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState(user?.target_role || "");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!resumeText.trim()) {
      setError("Paste your resume text first.");
      return;
    }
    setLoading(true);
    setError("");
    setFeedback("");
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, resumeText, targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <h2 className="font-display text-3xl text-paper mb-1">Resume review</h2>
      <p className="text-slate font-body text-sm mb-6">
        Paste your resume as plain text. You'll get specific line-level feedback, not generic tips.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role (e.g. Full-stack developer)"
            className="w-full bg-ink-soft border border-[#2E333F] rounded-sm px-4 py-2.5 text-paper font-body text-sm outline-none focus:border-compass"
          />
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={18}
            placeholder="Paste resume text here..."
            className="w-full bg-ink-soft border border-[#2E333F] rounded-sm px-4 py-3 text-paper font-body text-sm outline-none focus:border-compass resize-none"
          />
          {error && <p className="text-rose text-sm font-mono">{error}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="bg-compass text-ink font-mono text-sm uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-compass-dim transition-colors disabled:opacity-50"
          >
            {loading ? "Reviewing..." : "Get feedback"}
          </button>
        </div>

        <div className="bg-ink-soft border border-[#2E333F] rounded-sm px-5 py-4 font-body text-sm text-paper whitespace-pre-wrap overflow-y-auto max-h-[600px]">
          {feedback || <span className="text-slate italic">Feedback will appear here.</span>}
        </div>
      </div>
    </div>
  );
}
