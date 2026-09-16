import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockPrograms } from "../../services/mockData.js";
import { api } from "../../services/api.js";

export default function ProgramSelect() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState(mockPrograms);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    api.programs.list()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            id: p._id || p.id,
            name: p.name,
            description: p.description,
          }));
          setPrograms(mapped);
        }
      })
      .catch(() => {
        // Fall back to mock programs silently when offline
      });
  }, []);

  function onContinue(e) {
    e.preventDefault();
    if (!selected) {
      setError("Select a program.");
      return;
    }
    sessionStorage.setItem("yuwa.programId", selected);
    navigate("/schools");
  }

  return (
    <section>
      <h1>Select Program</h1>
      {error ? <div className="banner err">{error}</div> : null}
      <form onSubmit={onContinue} className="card">
        {programs.map((p) => (
          <label key={p.id}>
            <input
              type="radio"
              name="program"
              value={p.id}
              checked={selected === p.id}
              onChange={() => setSelected(p.id)}
            />{" "}
            <strong>{p.name}</strong>
            <span className="muted"> — {p.description}</span>
          </label>
        ))}
        <p>
          <button type="submit">Continue</button>{" "}
          <Link to="/">Cancel</Link>
        </p>
      </form>
    </section>
  );
}

