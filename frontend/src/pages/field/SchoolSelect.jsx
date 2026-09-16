import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockSchools } from "../../services/mockData.js";

export default function SchoolSelect() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  function onContinue(e) {
    e.preventDefault();
    if (!selected) {
      setError("Select a school.");
      return;
    }
    sessionStorage.setItem("yuwa.schoolId", selected);
    navigate("/activities/new");
  }

  return (
    <section>
      <h1>Select school</h1>
      {error ? <div className="banner err">{error}</div> : null}
      <form onSubmit={onContinue} className="card">
        {mockSchools.map((s) => (
          <label key={s.id}>
            <input
              type="radio"
              name="school"
              value={s.id}
              checked={selected === s.id}
              onChange={() => setSelected(s.id)}
            />{" "}
            {s.name} <span className="muted">({s.location})</span>
          </label>
        ))}
        <p>
          <button type="submit">Continue</button>{" "}
          <Link to="/programs">Back</Link>
        </p>
      </form>
    </section>
  );
}
