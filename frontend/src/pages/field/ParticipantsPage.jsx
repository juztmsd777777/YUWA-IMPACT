import { useState } from "react";
import { Link } from "react-router-dom";

export default function ParticipantsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", score: "" });
  const [error, setError] = useState("");

  function onAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setError("");
    setRows((r) => [...r, { ...form, school: "Current school" }]);
    setForm({ name: "", age: "", score: "" });
  }

  return (
    <section>
      <h1>Participants</h1>
      <p className="muted">FE 1 — keep this basic for MVP.</p>
      {error ? <div className="banner err">{error}</div> : null}
      <form onSubmit={onAdd} className="card">
        <label htmlFor="pname">Name</label>
        <input
          id="pname"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          min="0"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <label htmlFor="score">Score</label>
        <input
          id="score"
          type="number"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
        />
        <p>
          <button type="submit">Add</button> <Link to="/activities/new">Back to activity</Link>
        </p>
      </form>
      <div className="card">
        {rows.length === 0 ? (
          <p className="muted">No participants yet.</p>
        ) : (
          <ul>
            {rows.map((p, i) => (
              <li key={i}>
                {p.name}, {p.age || "—"} — score {p.score || "—"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
