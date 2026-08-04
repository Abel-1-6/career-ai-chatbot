
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ResumeReview({ user }) {
 const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.target_role || "");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
   if (!resumeFile) {
  setError("Please upload a PDF resume.");
  return;
}
    setLoading(true);
    setError("");
    setFeedback("");
    try {
     const formData = new FormData();

formData.append("userId", user.id);
formData.append("targetRole", targetRole);
formData.append("resume", resumeFile);

const res = await fetch(`${API_URL}/api/resume`, {
  method: "POST",
  body: formData,
});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setScore(data.score);
setFeedback(data.feedback);
}catch (err) {
  console.error(err);

  setError(err.message || "Review failed");

} finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <h2 className="font-display text-3xl text-paper mb-1">Resume review</h2>
      <p className="text-slate font-body text-sm mb-6">
       Upload your resume as a PDF. You'll receive an AI-powered review, resume score, ATS suggestions, and personalized improvements..
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role (e.g. Full-stack developer)"
            className="w-full bg-ink-soft border border-[#2E333F] rounded-sm px-4 py-2.5 text-paper font-body text-sm outline-none focus:border-compass"
          />
          <input
  type="file"
  accept=".pdf"
  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
  className="w-full bg-ink-soft border border-[#2E333F] rounded-sm px-4 py-3 text-paper"
/>

{resumeFile && (
  <p className="text-slate text-sm mt-2">
    📄 {resumeFile.name}
  </p>
)}
          {error && <p className="text-rose text-sm font-mono">{error}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="bg-compass text-ink font-mono text-sm uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-compass-dim transition-colors disabled:opacity-50"
          >
            {loading ? "Reviewing..." : "Get feedback"}
          </button>
        </div>

       <div className="bg-ink-soft border border-[#2E333F] rounded-sm p-5 overflow-y-auto max-h-[600px]">

  {score !== null && (
    <div
      className={`rounded-lg p-5 mb-6 text-center ${
        score >= 80
          ? "bg-green-700"
          : score >= 60
          ? "bg-yellow-600"
          : "bg-red-700"
      }`}
    >
      <p className="text-sm uppercase tracking-wide">
        Resume Score
      </p>

      <h2 className="text-5xl font-bold mt-2">
        {score}/100
      </h2>
    </div>
  )}

  {feedback ? (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {feedback}
      </ReactMarkdown>
    </div>
  ) : (
    <span className="text-slate italic">
      Feedback will appear here.
    </span>
  )}

</div>
      </div>
    </div>
  );
}
