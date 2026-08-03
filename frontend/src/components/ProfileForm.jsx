import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

const EXPERIENCE_LEVELS = [
  { value: "student", label: "Student" },
  { value: "entry", label: "Entry-level" },
  { value: "mid", label: "Mid-career" },
  { value: "senior", label: "Senior" },
  { value: "career-change", label: "Changing careers" },
];

export default function ProfileForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    currentRole: "",
    experienceLevel: "student",
    targetRole: "",
    skills: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Tell me your name first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not create profile");
      const user = await res.json();
      onCreated(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-6">
      <h1 className="font-display text-4xl text-paper mb-2">Plot your course.</h1>
      <p className="text-slate font-body mb-8">
        A few details so your advisor gives you specific guidance instead of generic advice.
      </p>

      <form onSubmit={submit} className="space-y-5 font-body">
        <Field label="Your name">
          <input
            value={form.name}
            onChange={update("name")}
            placeholder="Abel Takele"
            className="input"
          />
        </Field>

        <Field label="Current role (optional)">
          <input
            value={form.currentRole}
            onChange={update("currentRole")}
            placeholder="e.g. CS student, Software Engineer.."
            className="input"
          />
        </Field>

        <Field label="Experience level">
          <select value={form.experienceLevel} onChange={update("experienceLevel")} className="input">
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Target role / goal">
          <input
            value={form.targetRole}
            onChange={update("targetRole")}
            placeholder="e.g. Full-stack developer"
            className="input"
          />
        </Field>

        <Field label="Skills (comma-separated)">
          <input
            value={form.skills}
            onChange={update("skills")}
            placeholder="Java, React, SQL, Node.js"
            className="input"
          />
        </Field>

        <Field label="Interests (optional)">
          <input
            value={form.interests}
            onChange={update("interests")}
            placeholder="e.g. fintech, developer tools"
            className="input"
          />
        </Field>

        {error && <p className="text-rose text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-compass text-ink font-mono uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-compass-dim transition-colors disabled:opacity-50"
        >
          {loading ? "Setting course..." : "Start"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: #1B1F27;
          border: 1px solid #2E333F;
          color: #EDEAE1;
          padding: 0.65rem 0.85rem;
          border-radius: 2px;
          outline: none;
        }
        .input:focus {
          border-color: #C9A227;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wide text-slate mb-1.5">{label}</span>
      {children}
    </label>
  );
}
